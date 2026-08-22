import React, { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const formatMessageTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  const now = new Date();

  const isToday = messageDate.toDateString() === now.toDateString();

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return messageDate.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
};
const ChatSidebar = ({ conversations, selectedChat, onSelectChat, darkMode }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredChats = conversations.filter((chat) =>
    chat.username.toLowerCase().includes(search.toLowerCase()),
  );
  const handleBackChats = () => {
    navigate("/");
  };
  return (
    <div className=" flex flex-col ">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackChats}
            className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#181818]
                  border
                  border-gray-700
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:text-white
                  hover:bg-[#222]
                  transition
                "
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Chats</h1>

          <MessageCircle size={21} className="text-[#1E90FF]" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-[#181818] border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-600 transition"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center text-gray-600 text-sm py-10 px-4">
            No conversations found.
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              selected={selectedChat?.id === chat.id}
              onClick={() => onSelectChat(chat)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ChatListItem = ({ chat, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
        selected ? "bg-[#1a1a1a]" : "hover:bg-[#161616]"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={chat.image}
          alt={chat.username}
          className="w-12 h-12 rounded-full object-cover"
        />

        {chat.online && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#101010] rounded-full" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium truncate">{chat.username}</h3>

          <span className="text-[11px] text-gray-600 shrink-0">
            {formatMessageTime(chat.lastMessageTime)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={`text-sm truncate ${
              chat.unread > 0 ? "text-gray-200 font-medium" : "text-gray-500"
            }`}
          >
            {chat.lastMessage}
          </p>

          {chat.unread > 0 && (
            <span className="bg-[#1E90FF] text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center shrink-0">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatSidebar;
