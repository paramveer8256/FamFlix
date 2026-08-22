import User from "../models/user.model.js";
import Friendship from "../models/friendship.model.js";

export async function sendFriendRequest(req, res) {
  try {
    const requesterId = req.user._id;
    const { userId } = req.params;

    // Can't send request to yourself
    if (requesterId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    // Check if target user exists
    const recipient = await User.findById(userId);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check existing friendship/request
    const existingFriendship = await Friendship.findOne({
      $or: [
        {
          requester: requesterId,
          recipient: userId,
        },
        {
          requester: userId,
          recipient: requesterId,
        },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "You are already friends",
        });
      }

      if (existingFriendship.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "Friend request already exists",
        });
      }

      // If previous request was rejected,
      // allow sending a new request.
      existingFriendship.requester = requesterId;
      existingFriendship.recipient = userId;
      existingFriendship.status = "pending";

      await existingFriendship.save();

      return res.status(200).json({
        success: true,
        message: "Friend request sent",
      });
    }

    // Create new request
    await Friendship.create({
      requester: requesterId,
      recipient: userId,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    console.error("sendFriendRequest:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const userId = req.user._id;

    const requests = await Friendship.find({
      recipient: userId,
      status: "pending",
    })
      .populate("requester", "username image online")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("getFriendRequests:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await Friendship.findOne({
      _id: requestId,
      recipient: userId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    request.status = "accepted";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    console.error("acceptFriendRequest:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getFriends(req, res) {
  try {
    const userId = req.user._id;

    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    })
      .populate("requester", "username image online")
      .populate("recipient", "username image online")
      .sort({ updatedAt: -1 });

    const friends = friendships.map((friendship) => {
      const friend =
        friendship.requester._id.toString() === userId.toString()
          ? friendship.recipient
          : friendship.requester;

      return {
        friendshipId: friendship._id,
        _id: friend._id,
        username: friend.username,
        image: friend.image,
        online: friend.online,
      };
    });

    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    console.error("getFriends:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function rejectFriendRequest(req, res) {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await Friendship.findOne({
      _id: requestId,
      recipient: userId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    request.status = "rejected";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });
  } catch (error) {
    console.error("rejectFriendRequest:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function removeFriend(req, res) {
  try {
    const userId = req.user._id;
    const { userId: friendId } = req.params;

    if (userId.toString() === friendId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself",
      });
    }

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
      return res.status(404).json({
        success: false,
        message: "Friendship not found",
      });
    }

    await friendship.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error("removeFriend:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function searchUsers(req, res) {
  try {
    const userId = req.user._id;
    const { username } = req.query;

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const users = await User.find({
      _id: { $ne: userId },
      username: {
        $regex: username.trim(),
        $options: "i",
      },
    })
      .select("_id username image online")
      .limit(20);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("searchUsers:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getFriendshipStatus(req, res) {
  try {
    const userId = req.user._id;
    const { userId: otherUserId } = req.params;

    if (userId.toString() === otherUserId) {
      return res.status(200).json({
        success: true,
        status: "self",
      });
    }

    const friendship = await Friendship.findOne({
      $or: [
        {
          requester: userId,
          recipient: otherUserId,
        },
        {
          requester: otherUserId,
          recipient: userId,
        },
      ],
    });

    // No relationship
    if (!friendship) {
      return res.status(200).json({
        success: true,
        status: "none",
      });
    }

    // Already friends
    if (friendship.status === "accepted") {
      return res.status(200).json({
        success: true,
        status: "friends",
        friendshipId: friendship._id,
      });
    }

    // Pending request
    if (friendship.status === "pending") {
      const sentByMe = friendship.requester.toString() === userId.toString();

      return res.status(200).json({
        success: true,
        status: sentByMe ? "pending_sent" : "pending_received",
        friendshipId: friendship._id,
      });
    }

    // Previously rejected
    return res.status(200).json({
      success: true,
      status: "none",
    });
  } catch (error) {
    console.error("getFriendshipStatus:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getFriendProfile(req, res) {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "_id username image online",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Friendship status
    const friendship = await Friendship.findOne({
      $or: [
        {
          requester: currentUserId,
          recipient: userId,
        },
        {
          requester: userId,
          recipient: currentUserId,
        },
      ],
    });

    let friendshipStatus = "none";

    if (currentUserId.toString() === userId.toString()) {
      friendshipStatus = "self";
    } else if (friendship) {
      if (friendship.status === "accepted") {
        friendshipStatus = "friends";
      } else if (friendship.status === "pending") {
        friendshipStatus =
          friendship.requester.toString() === currentUserId.toString()
            ? "pending_sent"
            : "pending_received";
      }
    }

    // Friends count
    const friendsCount = await Friendship.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    /*
     * These two should eventually come from your
     * watch history / watchlist collections.
     */

    const watchedCount = 0;

    const currentlyWatching = null;

    const recentlyWatched = [];

    const watchlist = [];

    return res.status(200).json({
      success: true,

      profile: {
        _id: user._id,
        username: user.username,
        image: user.image,
        online: user.online,

        friendsCount,
        watchedCount,

        friendshipStatus,

        currentlyWatching,
        recentlyWatched,
        watchlist,
      },
    });
  } catch (error) {
    console.error("getFriendProfile:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
