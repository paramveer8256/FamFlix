import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

import socket from "./socket.js";
import { usePresenceStore } from "./store/presence.js";
import { useAuthUserStore } from "./store/authUser.js";

// Components
import Footer from "./components/Footer";
import AvatarSelector from "./components/AvatarSelector.jsx";

// Auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

// Main pages
import HomePage from "./pages/home/HomePage";
import WatchPage from "./pages/WatchPage.jsx";
import WatchList from "./pages/WatchList.jsx";
import GenrePage from "./pages/GenrePage.jsx";
import Updates from "./pages/Updates.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ActorMovies from "./pages/ActorMovies.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Friends
import Friends from "./pages/Friends";
import Chats from "./pages/Chats.jsx";

// Anime
import AnimeHomePage from "./pages/home/AnimeHomePage.jsx";
import AnimeWatchPage from "./pages/ANIFLIX/AnimeWatchPage.jsx";
import AnimeSearchPage from "./pages/ANIFLIX/AnimeSearchPage.jsx";
import AnimeNews from "./pages/ANIFLIX/AnimeNews.jsx";
import AnimeGenre from "./pages/ANIFLIX/AnimeGenre.jsx";
import AnimeWatchlist from "./pages/ANIFLIX/AnimeWatchlist.jsx";
import AnimeHistory from "./pages/ANIFLIX/AnimeHistory.jsx";
import AnimeProfile from "./pages/ANIFLIX/AnimeProfile.jsx";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthUserStore();

  const { setUserStatus, setOnlineUsers } = usePresenceStore();

  const location = useLocation();

  /*
   * Check authentication when app starts
   */
  useEffect(() => {
    authCheck();
  }, [authCheck]);

  /*
   * Socket connection
   */
  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user]);

  /*
   * Listen for online/offline status changes
   */
  useEffect(() => {
    const handleUserStatusChange = ({ userId, online }) => {
      setUserStatus(userId, online);
    };

    socket.on("user_status_changed", handleUserStatusChange);

    return () => {
      socket.off("user_status_changed", handleUserStatusChange);
    };
  }, [setUserStatus]);

  /*
   * Receive list of users who are already online
   */
  useEffect(() => {
    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [setOnlineUsers]);

  /*
   * Authentication loading screen
   */
  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader className="animate-spin text-[#1E90FF] size-10" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* ==================== MAIN ==================== */}

        <Route path="/" element={<HomePage />} />

        <Route
          path="/search"
          element={user ? <SearchPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/history"
          element={user ? <HistoryPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/watchlist"
          element={user ? <WatchList /> : <Navigate to="/login" />}
        />

        <Route
          path="/updates"
          element={user ? <Updates /> : <Navigate to="/login" />}
        />

        {/* ==================== AUTH ==================== */}

        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/" />}
        />

        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/" />}
        />

        <Route
          path="/reset-password/:token"
          element={!user ? <ResetPassword /> : <Navigate to="/" />}
        />

        <Route
          path="/change-password"
          element={user ? <ChangePassword /> : <Navigate to="/login" />}
        />

        {/* ==================== MOVIES / TV ==================== */}

        <Route
          path="/watch/:category/:id"
          element={user ? <WatchPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/genre/:category/:id/:genreName"
          element={user ? <GenrePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/actor/movie/:id/:name"
          element={user ? <ActorMovies /> : <Navigate to="/login" />}
        />

        {/* ==================== PROFILE ==================== */}

        <Route
          path="/profile/:username"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/edit-profile"
          element={user ? <AvatarSelector /> : <Navigate to="/login" />}
        />

        {/* ==================== FRIENDS / CHAT ==================== */}

        <Route
          path="/friends"
          element={user ? <Friends /> : <Navigate to="/login" />}
        />

        <Route
          path="/chats"
          element={user ? <Chats /> : <Navigate to="/login" />}
        />

        {/* ==================== ANIME ==================== */}

        <Route
          path="/anime"
          element={user ? <AnimeHomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/anime/watch/:id"
          element={user ? <AnimeWatchPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/anime/search"
          element={user ? <AnimeSearchPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/anime/history"
          element={user ? <AnimeHistory /> : <Navigate to="/login" />}
        />

        <Route
          path="/anime/watchlist"
          element={user ? <AnimeWatchlist /> : <Navigate to="/login" />}
        />

        <Route
          path="/genre/anime/:id/:genreName"
          element={user ? <AnimeSearchPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/anime/profile/:username"
          element={user ? <AnimeProfile /> : <Navigate to="/login" />}
        />

        <Route
          path="/anime/news"
          element={user ? <AnimeNews /> : <Navigate to="/login" />}
        />

        {/* ==================== 404 ==================== */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!["/edit-profile", "/chats"].includes(location.pathname) && <Footer />}
      
      <Toaster position="top-center" />

      <ToastContainer toastStyle={{ color: "black" }} />
    </>
  );
}

export default App;

// bg-[#1E90FF] hover:bg-[#1f88e5] active:bg-[#529af1]
