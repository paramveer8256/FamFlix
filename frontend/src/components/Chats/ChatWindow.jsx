import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import axios from "axios";
import socket from "../../socket.js";
import { useAuthUserStore } from "../../store/authUser.js";

const ChatWindow = ({ chat, onBack }) => {
  const { user } = useAuthUserStore();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // ============================================================
  // LOAD / CREATE CONVERSATION
  // ============================================================

  useEffect(() => {
    if (!chat) return;

    /*
      chat.friendId must be the friend's User._id.

      Example:
      {
        id: conversationId,
        friendId: "67f09fb...",
        username: "Rahul",
        image: "...",
        online: true
      }
    */

    const friendId = chat.friendId;

    if (!friendId) {
      console.error("Friend ID missing from chat:", chat);
      return;
    }

    const loadConversation = async () => {
      try {
        setLoading(true);
        setMessages([]);
        setConversation(null);

        // Get existing conversation or create one
        const conversationResponse = await axios.post(
          `/api/v1/chats/conversation/${friendId}`,
        );

        if (!conversationResponse.data.success) {
          return;
        }

        const conversationData = conversationResponse.data.conversation;

        setConversation(conversationData);

        // Join Socket.IO conversation room
        socket.emit("join_conversation", conversationData._id);

        // Get messages
        const messagesResponse = await axios.get(
          `/api/v1/chats/conversation/${conversationData._id}/messages`,
        );

        if (messagesResponse.data.success) {
          setMessages(messagesResponse.data.messages);

          // Mark received messages as read
          await axios.patch(
            `/api/v1/chats/conversation/${conversationData._id}/read`,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load conversation:",
          error.response?.data || error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [chat]);

  // ============================================================
  // SOCKET - RECEIVE NEW MESSAGE
  // ============================================================

  useEffect(() => {
    if (!conversation?._id) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.conversation?.toString() !== conversation._id.toString()) {
        return;
      }

      setMessages((prev) => {
        const alreadyExists = prev.some((msg) => msg._id === newMessage._id);

        if (alreadyExists) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);

      socket.emit("leave_conversation", conversation._id);
    };
  }, [conversation?._id]);

  // ============================================================
  // SCROLL TO BOTTOM
  // ============================================================

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages]);

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSend = async () => {
    const text = message.trim();

    if (!text || !conversation || sending) {
      return;
    }

    try {
      setSending(true);

      const response = await axios.post(
        `/api/v1/chats/conversation/${conversation._id}/messages`,
        {
          text,
        },
      );

      if (response.data.success) {
        const newMessage = response.data.message;

        setMessages((prev) => {
          const alreadyExists = prev.some((msg) => msg._id === newMessage._id);

          if (alreadyExists) {
            return prev;
          }

          return [...prev, newMessage];
        });

        setMessage("");

        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }

        /*
          Keep textarea focused.

          This is important because:
          - keyboard stays open on mobile
          - user can immediately type another message
        */
        requestAnimationFrame(() => {
          textareaRef.current?.focus();
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error.response?.data || error);
    } finally {
      setSending(false);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  // ============================================================
  // ENTER TO SEND
  // ============================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============================================================
  // TEXTAREA RESIZE
  // ============================================================

  const resizeTextarea = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const maxHeight = 160;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    requestAnimationFrame(() => {
      resizeTextarea();
    });
  };

  // ============================================================
  // NO CHAT SELECTED
  // ============================================================

  if (!chat) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center mb-4">
          <Send size={26} className="text-gray-600" />
        </div>

        <h2 className="text-lg font-semibold text-gray-300">Your messages</h2>

        <p className="text-sm text-gray-600 mt-2 max-w-sm">
          Select a friend from the left to start chatting.
        </p>
      </div>
    );
  }

  // ============================================================
  // CHAT WINDOW
  // ============================================================

  return (
    <div className="h-full min-h-0 flex flex-col">
      {/* Header */}

      <div className="h-[70px] shrink-0 border-b border-gray-800 px-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white p-2 transition"
        >
          <ArrowLeft size={21} />
        </button>

        {/* Avatar */}

        <div className="relative">
          <img
            src={chat.image}
            alt={chat.username}
            className="w-10 h-10 rounded-full object-cover"
          />

          {chat.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#101010] rounded-full" />
          )}
        </div>

        {/* User */}

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{chat.username}</h2>

          <p className="text-xs">
            {chat.online ? (
              <span className="text-green-500">Online</span>
            ) : (
              <span className="text-gray-600">Offline</span>
            )}
          </p>
        </div>

        <button className="text-gray-500 hover:text-white p-2">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}

      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5 space-y-3"
      >
        <div className="flex justify-center mb-6">
          <span className="text-[11px] text-gray-600 bg-[#181818] px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="text-sm text-gray-600">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center py-10">
            <span className="text-sm text-gray-600">
              No messages yet. Say hello 👋
            </span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id?.toString() === user?._id?.toString();

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] ${
                    isMe ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-[#1E90FF] text-white rounded-br-md"
                        : "bg-[#202020] text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-gray-600">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {isMe && (
                      <CheckCheck
                        size={13}
                        className={msg.read ? "text-blue-400" : "text-gray-600"}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}

      <div className="shrink-0 border-t border-gray-800 p-3 sm:p-4">
        <div className="flex items-end gap-2">
          {/* Attachment */}

          <button
            type="button"
            className="hidden sm:flex p-2 text-gray-500 hover:text-gray-300 transition"
          >
            <Paperclip size={19} />
          </button>

          {/* Textarea */}

          <div className="flex-1 bg-[#181818] border border-gray-800 focus-within:border-gray-600 rounded-2xl flex items-end px-3 py-2 transition">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="
                flex-1
                bg-transparent
                text-base
                text-white
                placeholder-gray-600
                outline-none
                resize-none
                overflow-y-auto
                max-h-40
                leading-6
                py-1
              "
            />

            {/* Emoji */}

            <button
              type="button"
              className="p-1 text-gray-500 hover:text-gray-300 transition shrink-0"
            >
              <Smile size={19} />
            </button>
          </div>

          {/* Send */}

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className={`p-3 rounded-full shrink-0 transition ${
              message.trim() && !sending
                ? "bg-[#1E90FF] text-white hover:bg-blue-600"
                : "bg-[#181818] text-gray-700"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
