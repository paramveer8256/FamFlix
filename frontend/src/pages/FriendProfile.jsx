import React, { useEffect, useState } from "react";
import { X, Circle, Play, Send, UserPlus, Check, Clock } from "lucide-react";
import { usePresenceStore } from "../store/presence.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteConfirmationModal from "../components/DeleteModal.jsx";

const FriendProfile = ({ friend, onClose }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [profile, setProfile] = useState(null);

  const [watchlist, setWatchlist] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const onlineUsers = usePresenceStore((state) => state.onlineUsers);

  /* =========================================================
     LIVE ONLINE STATUS
  ========================================================= */

  const isOnline =
    onlineUsers[friend?._id] ?? profile?.online ?? friend?.online ?? false;

  /* =========================================================
     LOAD FRIEND PROFILE
  ========================================================= */

  useEffect(() => {
    if (!friend?._id) return;

    const fetchFriendProfile = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `/api/v1/friends/profile/${friend._id}`,
        );

        if (response.data.success) {
          setProfile(response.data.profile);
        }
      } catch (error) {
        console.error(
          "Failed to load friend profile:",
          error.response?.data || error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [friend?._id]);

  /* =========================================================
     LOAD FRIEND WATCHLIST + WATCH HISTORY
  ========================================================= */

  useEffect(() => {
    if (!friend?._id) return;

    const fetchFriendContent = async () => {
      try {
        setLoadingContent(true);

        const [watchlistResponse, historyResponse] = await Promise.all([
          axios.get(`/api/v1/watchlist/user/${friend._id}`),
          axios.get(`/api/v1/watchhistory/user/${friend._id}`),
        ]);

        /* ================= WATCHLIST ================= */

        if (watchlistResponse.data.success) {
          setWatchlist(watchlistResponse.data.content || []);
        }

        /* ================= WATCH HISTORY ================= */

        if (historyResponse.data.success) {
          setWatchHistory(historyResponse.data.content || []);
        }
      } catch (error) {
        console.error(
          "Failed to load friend content:",
          error.response?.data || error,
        );
      } finally {
        setLoadingContent(false);
      }
    };

    fetchFriendContent();
  }, [friend?._id]);

  /* =========================================================
     SEND FRIEND REQUEST
  ========================================================= */

  const handleSendRequest = async () => {
    if (!friend?._id || actionLoading) return;

    try {
      setActionLoading(true);

      const response = await axios.post(
        `/api/v1/friends/request/${friend._id}`,
      );

      if (response.data.success) {
        setProfile((prev) => ({
          ...prev,
          friendshipStatus: "pending_sent",
        }));
      }
    } catch (error) {
      console.error(
        "Failed to send friend request:",
        error.response?.data || error,
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     ACCEPT FRIEND REQUEST
  ========================================================= */

  const handleAcceptRequest = async () => {
    if (!profile?.friendshipId || actionLoading) return;

    try {
      setActionLoading(true);

      const response = await axios.patch(
        `/api/v1/friends/request/${profile.friendshipId}/accept`,
      );

      if (response.data.success) {
        setProfile((prev) => ({
          ...prev,
          friendshipStatus: "friends",
        }));
      }
    } catch (error) {
      console.error(
        "Failed to accept friend request:",
        error.response?.data || error,
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     REMOVE FRIEND
  ========================================================= */

  const handleRemoveFriend = async () => {
    if (!friend?._id || actionLoading) return;

    try {
      setActionLoading(true);

      const response = await axios.delete(`/api/v1/friends/${friend._id}`);

      if (response.data.success) {
        setProfile((prev) => ({
          ...prev,
          friendshipStatus: "none",
          friendshipId: null,
        }));
      }
    } catch (error) {
      console.error("Failed to remove friend:", error.response?.data || error);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     MESSAGE
  ========================================================= */

  const handleMessage = () => {
    if (!profile) return;

    navigate("/chats", {
      state: {
        friend: {
          _id: profile._id,
          username: profile.username,
          image: profile.image,
          online: isOnline,
        },
      },
    });

    onClose?.();
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-4xl h-[500px] bg-[#101010] border border-gray-800 rounded-2xl flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-gray-500">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#101010] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================
            CLOSE
        ===================================================== */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-gray-800 text-gray-300 hover:text-white rounded-full p-2 transition"
        >
          <X size={20} />
        </button>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="overflow-y-auto max-h-[90vh]">
          {/* ===================================================
              PROFILE HEADER
          =================================================== */}

          <div className="px-6 sm:px-10 pt-10 pb-8 text-center border-b border-gray-800">
            {/* Avatar */}

            <div className="relative inline-block">
              <img
                src={profile.image}
                alt={profile.username}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-800"
              />

              {isOnline && (
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#101010] rounded-full" />
              )}
            </div>

            {/* Username */}

            <h2 className="text-2xl sm:text-3xl font-bold mt-4">
              {profile.username}
            </h2>

            {/* Online status */}

            <div className="flex items-center justify-center gap-2 text-sm mt-2">
              <Circle
                size={9}
                fill={isOnline ? "currentColor" : "none"}
                className={isOnline ? "text-green-500" : "text-gray-500"}
              />

              <span className={isOnline ? "text-green-500" : "text-gray-500"}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="flex justify-center items-center gap-6 mt-5 text-sm">
              {/* Friends */}

              <div>
                <span className="font-semibold text-white">
                  {profile.friendsCount ?? 0}
                </span>

                <span className="text-gray-500 ml-1">Friends</span>
              </div>

              <div className="w-px h-5 bg-gray-700" />

              {/* Watched */}

              <div>
                <span className="font-semibold text-white">
                  {watchHistory.length}
                </span>

                <span className="text-gray-500 ml-1">Watched</span>
              </div>
            </div>

            {/* =================================================
                ACTION BUTTON
            ================================================= */}

            <div className="flex justify-center mt-5">
              {/* FRIENDS */}

              {profile.friendshipStatus === "friends" && (
                <div className="flex gap-2">
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 bg-[#1E90FF] hover:bg-blue-600 px-5 py-2.5 rounded-lg font-medium transition"
                  >
                    <Send size={17} />
                    Message
                  </button>

                  <button
                    onClick={() => setShowRemoveModal(true)}
                    disabled={actionLoading}
                    className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-400 transition disabled:opacity-50"
                  >
                    {actionLoading ? "Removing..." : "Remove"}
                  </button>
                </div>
              )}

              {/* ADD FRIEND */}

              {profile.friendshipStatus === "none" && (
                <button
                  onClick={handleSendRequest}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-[#1E90FF] hover:bg-blue-600 px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
                >
                  <UserPlus size={17} />

                  {actionLoading ? "Sending..." : "Add Friend"}
                </button>
              )}

              {/* REQUEST SENT */}

              {profile.friendshipStatus === "pending_sent" && (
                <button
                  disabled
                  className="flex items-center gap-2 bg-[#181818] border border-gray-700 text-gray-400 px-5 py-2.5 rounded-lg font-medium"
                >
                  <Clock size={17} />
                  Request Sent
                </button>
              )}

              {/* REQUEST RECEIVED */}

              {profile.friendshipStatus === "pending_received" && (
                <button
                  onClick={handleAcceptRequest}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-[#1E90FF] hover:bg-blue-600 px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
                >
                  <Check size={17} />

                  {actionLoading ? "Accepting..." : "Accept Request"}
                </button>
              )}
            </div>
          </div>

          {/* ===================================================
              CONTENT SECTIONS
          =================================================== */}

          <div className="px-6 sm:px-10 py-8">
            {/* =================================================
      RECENTLY WATCHED
  ================================================= */}

            <section className="mb-10">
              <h3 className="text-lg font-semibold mb-4">Recently Watched</h3>

              {loadingContent ? (
                <p className="text-sm text-gray-600">
                  Loading watch history...
                </p>
              ) : watchHistory.length > 0 ? (
                <MovieGrid movies={watchHistory} />
              ) : (
                <p className="text-sm text-gray-600">
                  No recently watched movies.
                </p>
              )}
            </section>

            {/* =================================================
      WATCHLIST
  ================================================= */}

            <section>
              <h3 className="text-lg font-semibold mb-4">Watchlist</h3>

              {loadingContent ? (
                <p className="text-sm text-gray-600">Loading watchlist...</p>
              ) : watchlist.length > 0 ? (
                <MovieGrid movies={watchlist} />
              ) : (
                <p className="text-sm text-gray-600">Watchlist is empty.</p>
              )}
            </section>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveFriend}
        title="Remove Friend"
        message={`Are you sure you want to remove ${profile.username} from your friends?`}
      />
    </div>
  );
};

/* =========================================================
   MOVIE GRID
========================================================= */

const MovieGrid = ({ movies }) => {
  return (
    <div
      className="
        flex
        gap-3
        overflow-x-auto
        pb-3
        scrollbar-hide

      "
    >
      {movies.map((movie) => (
        <div
          key={movie.id || movie._id}
          className="
            group
            cursor-pointer
            shrink-0
            w-[130px]
            sm:w-[150px]
            md:w-[165px]
          "
        >
          <div className="overflow-hidden  rounded-lg bg-[#181818]">
            <img
              src={
                movie.image?.startsWith("http")
                  ? movie.image
                  : `https://image.tmdb.org/t/p/w500${movie.image}`
              }
              alt={movie.title}
              className="
                w-full
                aspect-[2/3]
                object-cover
                group-hover:scale-105
                transition
                duration-300
              "
            />
          </div>

          <p
            className="
              mt-2
              text-xs
              sm:text-sm
              text-gray-400
              group-hover:text-white
              truncate
              transition
            "
          >
            {movie.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FriendProfile;
