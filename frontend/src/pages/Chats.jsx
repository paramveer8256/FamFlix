import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import ChatSidebar from "../components/Chats/ChatSidebar.jsx";
import ChatWindow from "../components/Chats/ChatWindow.jsx";
import axios from "axios";
import socket from "../socket.js";
import { ArrowLeft } from "lucide-react";

const Chats = ({ initialChat = null, onClose = null }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState(initialChat);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * If Chats receives a friend from FriendProfile,
   * automatically select that friend.
   */
  useEffect(() => {
    if (initialChat) {
      setSelectedChat(initialChat);
    }
  }, [initialChat]);

  /*
   * ============================================================
   * LOAD CONVERSATIONS
   * ============================================================
   */

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);

        const [conversationResponse, unreadResponse] = await Promise.all([
          axios.get("/api/v1/chats"),
          axios.get("/api/v1/chats/unread"),
        ]);

        if (!conversationResponse.data.success) {
          return;
        }

        let fetchedConversations = conversationResponse.data.conversations;

        /*
         * Add unread counts
         */

        if (unreadResponse.data.success) {
          const unreadMap = {};

          unreadResponse.data.unread.forEach((item) => {
            unreadMap[item.conversationId] = item.count;
          });

          fetchedConversations = fetchedConversations.map((conversation) => ({
            ...conversation,
            unread: unreadMap[conversation.id] || 0,
          }));
        }

        setConversations(fetchedConversations);
      } catch (error) {
        console.error(
          "Failed to fetch conversations:",
          error.response?.data || error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  /*
   * ============================================================
   * SELECT CHAT
   * ============================================================
   */

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);

    /*
     * If this is an existing conversation,
     * mark its messages as read.
     */
    if (chat.id) {
      try {
        await axios.patch(`/api/v1/chats/conversation/${chat.id}/read`);

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id.toString() === chat.id.toString()
              ? {
                  ...conversation,
                  unread: 0,
                }
              : conversation,
          ),
        );
      } catch (error) {
        console.error(
          "Failed to mark messages as read:",
          error.response?.data || error,
        );
      }
    }
  };

  /*
   * ============================================================
   * CONVERSATION UPDATED
   * ============================================================
   */

  useEffect(() => {
    const handleConversationUpdated = (data) => {
      setConversations((prev) => {
        const exists = prev.some(
          (conversation) =>
            conversation.id.toString() === data.conversationId.toString(),
        );

        /*
         * Conversation already exists
         */

        if (exists) {
          return prev
            .map((conversation) => {
              if (
                conversation.id.toString() !== data.conversationId.toString()
              ) {
                return conversation;
              }

              return {
                ...conversation,
                lastMessage: data.lastMessage,
                lastMessageTime: data.lastMessageTime,
              };
            })
            .sort(
              (a, b) =>
                new Date(b.lastMessageTime || 0) -
                new Date(a.lastMessageTime || 0),
            );
        }

        /*
         * If backend sends a complete conversation object
         * for a newly created conversation, add it.
         */

        if (data.conversation) {
          return [data.conversation, ...prev];
        }

        return prev;
      });
    };

    socket.on("conversation_updated", handleConversationUpdated);

    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, []);

  /*
   * ============================================================
   * NEW MESSAGE NOTIFICATION
   * ============================================================
   */

  useEffect(() => {
    const handleNewMessageNotification = (newMessage) => {
      setConversations((prev) => {
        return prev
          .map((conversation) => {
            if (
              conversation.id.toString() !== newMessage.conversation.toString()
            ) {
              return conversation;
            }

            const isCurrentChat =
              selectedChat?.id?.toString() === conversation.id.toString();

            return {
              ...conversation,

              lastMessage: newMessage.text,
              lastMessageTime: newMessage.createdAt,

              /*
               * Don't increase unread count
               * if this chat is already open.
               */
              unread: isCurrentChat ? 0 : (conversation.unread || 0) + 1,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.lastMessageTime || 0) -
              new Date(a.lastMessageTime || 0),
          );
      });
    };

    socket.on("new_message_notification", handleNewMessageNotification);

    return () => {
      socket.off("new_message_notification", handleNewMessageNotification);
    };
  }, [selectedChat]);

  /*
   * ============================================================
   * ONLINE / OFFLINE STATUS
   * ============================================================
   */

  useEffect(() => {
    const handleUserStatusChange = ({ userId, online }) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.friendId?.toString() === userId.toString()
            ? {
                ...conversation,
                online,
              }
            : conversation,
        ),
      );

      /*
       * Also update currently selected chat
       */

      setSelectedChat((current) => {
        if (!current || current.friendId?.toString() !== userId.toString()) {
          return current;
        }

        return {
          ...current,
          online,
        };
      });
    };

    socket.on("user_status_changed", handleUserStatusChange);

    return () => {
      socket.off("user_status_changed", handleUserStatusChange);
    };
  }, []);

  /*
   * ============================================================
   * BACK
   * ============================================================
   */

  const handleBack = () => {
    if (onClose) {
      onClose();
      return;
    }

    setSelectedChat(null);
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="min-h-dvh bg-black text-white">
      <main>
        <div
          className={`
            bg-[#101010]
           
            overflow-hidden
            flex

            ${
              onClose
                ? `
                  fixed
                  inset-0
                  z-[200]
                  w-full
                  h-[100dvh]
                `
                : `
              h-[100dvh]                  
              min-h-0                  
                `
            }
          `}
        >
          {/* ================= SIDEBAR ================= */}

          <div
            className={`
              w-full
              md:w-[320px]
              lg:w-[350px]
              shrink-0
              border-r
              border-gray-800

              ${selectedChat ? "hidden md:block" : "block"}
            `}
          >
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Loading conversations...
              </div>
            ) : (
              <ChatSidebar
                conversations={conversations}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                darkMode={darkMode}
              />
            )}
          </div>

          {/* ================= CHAT WINDOW ================= */}

          <div
            className={`
    relative
    flex-1
    min-w-0
    min-h-0

    ${selectedChat ? "block" : "hidden md:block"}
  `}
          >
            {selectedChat && (
              <button
                onClick={handleBack}
                className="
        absolute
        top-4
        left-4
        z-[300]
        w-10
        h-10
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
            )}
            <ChatWindow
              chat={selectedChat}
              onBack={handleBack}
              darkMode={darkMode}
            />{" "}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chats;
