import User from "../models/user.model.js";
import Friendship from "../models/friendship.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export async function getOrCreateConversation(req, res) {
  try {
    const userId = req.user._id;
    const { userId: friendId } = req.params;

    // Cannot chat with yourself
    if (userId.toString() === friendId) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself",
      });
    }

    // Check if friend exists
    const friend = await User.findById(friendId).select(
      "_id username image online",
    );

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check friendship
    const friendship = await Friendship.findOne({
      $or: [
        {
          requester: userId,
          recipient: friendId,
        },
        {
          requester: friendId,
          recipient: userId,
        },
      ],
      status: "accepted",
    });

    if (!friendship) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with your friends",
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [userId, friendId],
      },
    }).populate("participants", "_id username image online");

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, friendId],
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "_id username image online",
      );
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("getOrCreateConversation:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getMessages(req, res) {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "_id username image")
      .populate("receiver", "_id username image")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("getMessages:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function sendMessage(req, res) {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // Check conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Find receiver
    const receiverId = conversation.participants.find(
      (participant) => participant.toString() !== userId.toString(),
    );

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      receiver: receiverId,
      text: text.trim(),
    });

    // Update conversation preview
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();

    await conversation.save();

    // Populate message
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "_id username image")
      .populate("receiver", "_id username image");

    // =====================================================
    // SOCKET.IO
    // =====================================================

    const io = req.app.get("io");

    if (io) {
      io.to(`conversation:${conversationId}`).emit(
        "new_message",
        populatedMessage,
      );
      
      // Specifically notify the receiver
      io.to(`user:${receiverId}`).emit(
        "new_message_notification",
        populatedMessage,
      );
    }
    io.to(`conversation:${conversationId}`).emit("conversation_updated", {
      conversationId,
      lastMessage: populatedMessage.text,
      lastMessageTime: populatedMessage.createdAt,
      senderId: populatedMessage.sender._id,
      receiverId: populatedMessage.receiver._id,
    });

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("sendMessage:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function markMessagesAsRead(req, res) {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    // Make sure the user belongs to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Mark only messages received by the current user as read
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("markMessagesAsRead:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getUnreadCounts(req, res) {
  try {
    const userId = req.user._id;

    const unreadMessages = await Message.aggregate([
      {
        $match: {
          receiver: userId,
          read: false,
        },
      },
      {
        $group: {
          _id: "$conversation",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          conversationId: "$_id",
          count: 1,
        },
      },
    ]);

    const total = unreadMessages.reduce((sum, item) => sum + item.count, 0);

    return res.status(200).json({
      success: true,
      unread: unreadMessages,
      total,
    });
  } catch (error) {
    console.error("getUnreadCounts:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getConversations(req, res) {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "_id username image online")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    const result = await Promise.all(
      conversations.map(async (conversation) => {
        const friend = conversation.participants.find(
          (participant) => participant._id.toString() !== userId.toString(),
        );

        if (!friend) return null;

        const unread = await Message.countDocuments({
          conversation: conversation._id,
          receiver: userId,
          read: false,
        });

        return {
          id: conversation._id,
          friendId: friend._id,
          username: friend.username,
          image: friend.image,
          online: friend.online,

          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageAt,

          unread,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      conversations: result.filter(Boolean),
    });
  } catch (error) {
    console.error("getConversations:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
