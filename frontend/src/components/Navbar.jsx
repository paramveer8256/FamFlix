import { LogOut, Menu, Search, UsersRound, MessageCircle } from "lucide-react";

import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthUserStore } from "../store/authUser.js";
import { useContentStore } from "../store/content.js";
import useGetGenres from "../hooks/useGetGenres.jsx";

import { Film as MovieIcon, Video, History, ListCheck } from "lucide-react";

import axios from "axios";
import socket from "../socket.js";

const Navbar = () => {
  const { user, logout } = useAuthUserStore();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Total unread messages
  const [unreadCount, setUnreadCount] = React.useState(0);

  const dropdownRef = useRef();

  const { contentType, setContentType } = useContentStore();

  const { data: genres = [] } = useGetGenres(contentType);

  const navigate = useNavigate();

  /*
   * ============================================================
   * MOBILE MENU
   * ============================================================
   */

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  function handlelogout() {
    logout();
    navigate("/login");
  }

  /*
   * ============================================================
   * CLOSE GENRE DROPDOWN
   * ============================================================
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * ============================================================
   * LOAD INITIAL UNREAD COUNT
   * ============================================================
   */

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get("/api/v1/chats/unread");

        if (!response.data.success) {
          return;
        }

        const total = response.data.unread.reduce(
          (sum, item) => sum + item.count,
          0,
        );

        setUnreadCount(total);
      } catch (error) {
        console.error(
          "Failed to fetch unread count:",
          error.response?.data || error,
        );
      }
    };

    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  /*
   * ============================================================
   * REAL-TIME NEW MESSAGE
   * ============================================================
   */

  useEffect(() => {
    if (!user) return;

    const handleNewMessageNotification = (newMessage) => {
      /*
       * The backend should only send this notification
       * to the receiver.
       *
       * Therefore every notification means:
       *
       * unread + 1
       */

      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_message_notification", handleNewMessageNotification);

    return () => {
      socket.off("new_message_notification", handleNewMessageNotification);
    };
  }, [user]);

  /*
   * ============================================================
   * REAL-TIME READ / UNREAD UPDATE
   * ============================================================
   *
   * When Chat page marks a conversation as read,
   * it should emit:
   *
   * "messages_marked_read"
   *
   * with:
   *
   * {
   *   count: number
   * }
   *
   */

  useEffect(() => {
    const handleMessagesMarkedRead = (data) => {
      const count = Number(data?.count || 0);

      if (count <= 0) return;

      setUnreadCount((prev) => Math.max(0, prev - count));
    };

    socket.on("messages_marked_read", handleMessagesMarkedRead);

    return () => {
      socket.off("messages_marked_read", handleMessagesMarkedRead);
    };
  }, []);

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <header className="max-w-6xl mx-auto flex flex-wrap justify-between items-center p-4 h-15">
      <div className="flex items-center justify-center gap-25 z-50">
        <Link to="/">
          <img
            src="/famflix logo wobg.png"
            alt="Logo"
            className="w-32 sm:w-40"
          />
        </Link>

        {/* =====================================================
            DESKTOP NAVBAR
        ===================================================== */}

        <div className="hidden lg:flex gap-20 items-center">
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>

          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("tv")}
          >
            TV Shows
          </Link>

          <Link to="/history" className="hover:underline">
            History
          </Link>

          <Link to="/watchlist" className="hover:underline">
            Watch List
          </Link>

          <div ref={dropdownRef} className="relative dropdown">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="hover:underline cursor-pointer"
            >
              Genres
            </button>

            {isOpen && (
              <div className="absolute left-[-50px] mt-2 bg-white text-black rounded-md shadow-lg w-40 z-50 max-h-60 overflow-y-auto">
                {genres.map((genre) => (
                  <Link
                    to={`/genre/${contentType}/${genre?.id}/${genre?.name}`}
                    key={genre?.id}
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {genre?.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex gap-4 items-center z-50">
        {/* Search */}

        <Link to="/search">
          <Search className="size-6 cursor-pointer hover:text-[#1E90FF] transition-colors" />
        </Link>

        {/* Friends */}

        <Link to="/friends" className="relative">
          <UsersRound className="size-6 cursor-pointer hover:text-[#1E90FF] transition-colors" />
        </Link>

        {/* =================================================
            CHAT
        ================================================= */}

        <Link to="/chats" className="relative">
          <MessageCircle className="size-6 cursor-pointer hover:text-[#1E90FF] transition-colors" />

          {/* Unread count */}

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile */}

        <img
          src={user.image}
          alt="Avatar logo"
          className="size-10 md:size-14 rounded-full cursor-pointer"
          onClick={() => {
            navigate(`/profile/${user.username}`);
          }}
        />

        {/* Mobile Menu */}

        <div className="lg:hidden">
          <Menu className="size-6 cursor-pointer" onClick={handleToggle} />
        </div>
      </div>

      {/* =====================================================
          MOBILE NAV
      ===================================================== */}

      {isMobile && (
        <div className="lg:hidden z-90 absolute top-20 left-0 w-full bg-black border border-gray-800 rounded-md shadow-lg">
          <Link
            to="/"
            className="hover:underline block"
            onClick={() => {
              handleToggle();
              setContentType("movie");
            }}
          >
            <div className="mx-2 mt-4 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <MovieIcon
                className="size-5 mx-2"
                onClick={() => {
                  handleToggle();
                  setContentType("movie");
                }}
              />
              Movies
            </div>
          </Link>

          <Link
            to="/"
            className="hover:underline block"
            onClick={() => {
              handleToggle();
              setContentType("tv");
            }}
          >
            <div className="m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <Video
                className="size-5 mx-2"
                onClick={() => {
                  handleToggle();
                  setContentType("tv");
                }}
              />
              TV Shows
            </div>
          </Link>

          <Link
            to="/history"
            className="hover:underline block"
            onClick={handleToggle}
          >
            <div className="m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <History className="size-5 mx-2" onClick={handleToggle} />
              History
            </div>
          </Link>

          <Link
            to="/watchlist"
            className="hover:underline block"
            onClick={handleToggle}
          >
            <div className="m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <ListCheck className="size-5 mx-2" onClick={handleToggle} />
              Watch List
            </div>
          </Link>

          <div className="m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
            <LogOut className="size-5 mx-2" onClick={handlelogout} />

            <p onClick={handlelogout}>Logout</p>
          </div>

          <Link to="#" className="px-2 text-xl block text-[#1E90FF]">
            Genres List
          </Link>

          <div className="px-4 pt-1 pb-4 flex flex-wrap text-sm gap-x-2 max-h-35 flex-col">
            {genres.map((genre) => (
              <Link
                to={`/genre/${contentType}/${genre?.id}/${genre?.name}`}
                key={genre?.id}
                className="py-0.5"
              >
                {genre?.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
