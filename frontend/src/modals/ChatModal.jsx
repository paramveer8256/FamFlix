import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  Image,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  X,
} from "lucide-react";

const ChatModal = ({ friend, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "friend",
      text: "Hey! Have you watched Interstellar?",
      time: "8:42 PM",
      read: true,
    },
    {
      id: 2,
      sender: "me",
      text: "Yeah! It's amazing 🔥",
      time: "8:43 PM",
      read: true,
    },
    {
      id: 3,
      sender: "friend",
      text: "I know right 😂 The ending was crazy.",
      time: "8:44 PM",
      read: true,
    },
    {
      id: 4,
      sender: "me",
      text: "That docking scene though 😭🔥",
      time: "8:45 PM",
      read: true,
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full h-full sm:h-[90vh] sm:max-w-2xl bg-[#101010] sm:border border-gray-800 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-[72px] shrink-0 border-b border-gray-800 px-4 flex items-center gap-3">
          {/* Mobile/back */}
          <button
            onClick={onClose}
            className="sm:hidden text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={21} />
          </button>

          {/* Avatar */}
          <div className="relative">
            <img
              src={friend.image}
              alt={friend.username}
              className="w-11 h-11 rounded-full object-cover"
            />

            {friend.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#101010] rounded-full" />
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{friend.username}</h2>

            <p className="text-xs text-gray-500">
              {friend.online ? (
                <span className="text-green-500">Online</span>
              ) : (
                "Offline"
              )}
            </p>
          </div>

          {/* Actions */}
          <button className="text-gray-400 hover:text-white p-2 transition">
            <MoreVertical size={20} />
          </button>

          <button
            onClick={onClose}
            className="hidden sm:block text-gray-400 hover:text-white p-2 transition"
          >
            <X size={21} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
          {/* Date */}
          <div className="flex justify-center mb-5">
            <span className="text-[11px] text-gray-500 bg-[#181818] px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === "me";

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-[65%] ${
                    isMe ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-[#1E90FF] text-white rounded-br-md"
                        : "bg-[#202020] text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-[10px] text-gray-600">
                      {msg.time}
                    </span>

                    {isMe && <CheckCheck size={13} className="text-blue-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Typing indicator - temporary */}
        {friend.online && (
          <div className="px-5 pb-2">
            <span className="text-xs text-gray-600">
              {friend.username} is online
            </span>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-gray-800 p-3 sm:p-4">
          <div className="flex items-end gap-2">
            {/* Attachment */}
            <button className="hidden sm:block p-2 text-gray-500 hover:text-gray-300 transition">
              <Paperclip size={20} />
            </button>

            {/* Image */}
            <button className="hidden sm:block p-2 text-gray-500 hover:text-gray-300 transition">
              <Image size={20} />
            </button>

            {/* Input */}
            <div className="flex-1 bg-[#181818] border border-gray-800 focus-within:border-gray-600 rounded-2xl flex items-end px-3 py-2 transition">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none resize-none max-h-28"
              />

              <button className="p-1 text-gray-500 hover:text-gray-300 transition">
                <Smile size={19} />
              </button>
            </div>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`p-3 rounded-full transition ${
                message.trim()
                  ? "bg-[#1E90FF] hover:bg-blue-600 text-white"
                  : "bg-[#181818] text-gray-600"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
