import React, { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  UsersRound,
  UserCheck,
  Clock,
  X,
  Check,
  Loader2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import FriendProfile from "./FriendProfile.jsx";
import { usePresenceStore } from "../store/presence.js";


const Friends = () => {

  const { onlineUsers } = usePresenceStore();

  const [activeTab, setActiveTab] = useState("friends");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [sendingRequest, setSendingRequest] = useState(null);
  const [requestAction, setRequestAction] = useState(null);

  /*
   * ============================================================
   * LOAD FRIENDS
   * ============================================================
   */

  const fetchFriends = async () => {
    try {
      setLoadingFriends(true);

      const response = await axios.get("/api/v1/friends");

      if (response.data.success) {
        setFriends(response.data.friends);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error.response?.data || error);

      toast.error(error.response?.data?.message || "Failed to load friends");
    } finally {
      setLoadingFriends(false);
    }
  };

  /*
   * ============================================================
   * LOAD FRIEND REQUESTS
   * ============================================================
   */

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);

      const response = await axios.get("/api/v1/friends/requests");

      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error(
        "Failed to fetch friend requests:",
        error.response?.data || error,
      );

      toast.error(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  /*
   * ============================================================
   * SEARCH USERS
   * ============================================================
   */

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await axios.get("/api/v1/friends/search", {
          params: {
            username: query,
          },
        });

        if (response.data.success) {
          setSearchResults(response.data.users);
        }
      } catch (error) {
        console.error("Failed to search users:", error.response?.data || error);

        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /*
   * ============================================================
   * SEND FRIEND REQUEST
   * ============================================================
   */

  const handleSendRequest = async (userId) => {
    try {
      setSendingRequest(userId);

      const response = await axios.post(`/api/v1/friends/request/${userId}`);

      if (response.data.success) {
        toast.success("Friend request sent");

        /*
         * Update the search result immediately.
         */
        setSearchResults((prev) =>
          prev.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  friendshipStatus: "pending_sent",
                }
              : user,
          ),
        );
      }
    } catch (error) {
      console.error(
        "Failed to send friend request:",
        error.response?.data || error,
      );

      toast.error(
        error.response?.data?.message || "Failed to send friend request",
      );
    } finally {
      setSendingRequest(null);
    }
  };

  /*
   * ============================================================
   * GET STATUS FOR SEARCH RESULT
   * ============================================================
   */

  const getUserStatus = async (userId) => {
    try {
      const response = await axios.get(`/api/v1/friends/status/${userId}`);

      if (response.data.success) {
        return response.data.status;
      }

      return "none";
    } catch (error) {
      console.error(
        "Failed to get friendship status:",
        error.response?.data || error,
      );

      return "none";
    }
  };

  /*
   * ============================================================
   * LOAD STATUS FOR SEARCH RESULTS
   * ============================================================
   */

  useEffect(() => {
    if (searchResults.length === 0) return;

    let cancelled = false;

    const loadStatuses = async () => {
      const updatedResults = await Promise.all(
        searchResults.map(async (user) => {
          /*
           * Don't request status again if we already know it.
           */
          if (user.friendshipStatus) {
            return user;
          }

          const status = await getUserStatus(user._id);

          return {
            ...user,
            friendshipStatus: status,
          };
        }),
      );

      if (!cancelled) {
        setSearchResults(updatedResults);
      }
    };

    loadStatuses();

    return () => {
      cancelled = true;
    };
  }, [searchResults.length]);

  /*
   * ============================================================
   * ACCEPT REQUEST
   * ============================================================
   */

  const handleAcceptRequest = async (requestId) => {
    try {
      setRequestAction(requestId);

      const response = await axios.patch(
        `/api/v1/friends/request/${requestId}/accept`,
      );

      if (response.data.success) {
        toast.success("Friend request accepted");

        /*
         * Remove request from requests immediately.
         */
        setRequests((prev) =>
          prev.filter((request) => request._id !== requestId),
        );

        /*
         * Reload friends so the new friend appears.
         */
        await fetchFriends();
      }
    } catch (error) {
      console.error("Failed to accept request:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Failed to accept friend request",
      );
    } finally {
      setRequestAction(null);
    }
  };

  /*
   * ============================================================
   * REJECT REQUEST
   * ============================================================
   */

  const handleRejectRequest = async (requestId) => {
    try {
      setRequestAction(requestId);

      const response = await axios.patch(
        `/api/v1/friends/request/${requestId}/reject`,
      );

      if (response.data.success) {
        toast.success("Friend request rejected");

        setRequests((prev) =>
          prev.filter((request) => request._id !== requestId),
        );
      }
    } catch (error) {
      console.error("Failed to reject request:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Failed to reject friend request",
      );
    } finally {
      setRequestAction(null);
    }
  };

  /*
   * ============================================================
   * FRIENDSHIP STATUS BUTTON
   * ============================================================
   */

  const renderSearchAction = (person) => {
    const status = person.friendshipStatus;

    if (sendingRequest === person._id) {
      return (
        <button
          disabled
          className="flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Loader2 size={16} className="animate-spin" />
          Sending
        </button>
      );
    }

    if (status === "friends") {
      return (
        <button
          disabled
          className="flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <UserCheck size={16} />
          Friends
        </button>
      );
    }

    if (status === "pending_sent") {
      return (
        <button
          disabled
          className="flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Clock size={16} />
          Pending
        </button>
      );
    }

    if (status === "pending_received") {
      return (
        <button
          disabled
          className="flex items-center gap-2 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Clock size={16} />
          Requested You
        </button>
      );
    }

    return (
      <button
        onClick={() => handleSendRequest(person._id)}
        className="flex items-center gap-2 bg-[#1E90FF] hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        <UserPlus size={16} />
        Add
      </button>
    );
  };

  /*
   * ============================================================
   * FRIEND CARD
   * ============================================================
   */

  const FriendCard = ({ friend }) => {
    const isOnline = onlineUsers?.[friend._id] ?? friend.online ?? false;

    return (
      <div
        onClick={() => setSelectedFriend(friend)}
        className="bg-[#141414] border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition cursor-pointer"
      >
        <div className="relative">
          <img
            src={friend.image}
            alt={friend.username}
            className="w-14 h-14 rounded-full object-cover"
          />

          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#141414] rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{friend.username}</h3>

          <p className="text-sm text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>

        <UserCheck size={20} className="text-gray-400" />
      </div>
    );
  };

  /*
   * ============================================================
   * REQUEST CARD
   * ============================================================
   */

  const RequestCard = ({ request }) => {
    const requester = request.requester;

    if (!requester) return null;

    const isProcessing = requestAction === request._id;

    return (
      <div className="bg-[#141414] border border-gray-800 rounded-xl p-4 flex items-center gap-4">
        <div className="relative">
          <img
            src={requester.image}
            alt={requester.username}
            className="w-12 h-12 rounded-full object-cover"
          />

          {requester.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{requester.username}</h3>

          <p className="text-sm text-gray-500">Wants to be your friend</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAcceptRequest(request._id)}
            disabled={isProcessing}
            className="flex items-center gap-1 bg-[#1E90FF] hover:bg-blue-600 disabled:opacity-50 px-3 py-2 rounded-lg text-sm font-medium transition"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            <span className="hidden sm:inline">Accept</span>
          </button>

          <button
            onClick={() => handleRejectRequest(request._id)}
            disabled={isProcessing}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-2 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  };

  /*
   * ============================================================
   * EMPTY STATE
   * ============================================================
   */

  const EmptyState = ({ icon, title, description }) => {
    return (
      <div className="border border-dashed border-gray-800 rounded-xl py-20 flex flex-col items-center text-center">
        <div className="text-gray-600 mb-4">{icon}</div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        <p className="text-gray-500 max-w-sm">{description}</p>
      </div>
    );
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:py-8 py-4">
        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Friends</h1>

            <p className="text-gray-400 mt-2">
              Connect with people and discover what they're watching.
            </p>
          </div>

          {/* Search */}

          {/* <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="text"
              placeholder="Find people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) {
                  setActiveTab("find");
                }
              }}
              className="w-full bg-[#181818] border border-gray-700 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-[#1E90FF] transition"
            />
          </div> */}
        </div>

        {/* Tabs */}

        <div className="flex items-center gap-2 border-b border-gray-800 mb-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition ${
              activeTab === "friends"
                ? "text-white border-b-2 border-[#1E90FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UsersRound size={18} />
            My Friends
            <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full">
              {friends.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition ${
              activeTab === "requests"
                ? "text-white border-b-2 border-[#1E90FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock size={18} />
            Requests
            <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("find")}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition ${
              activeTab === "find"
                ? "text-white border-b-2 border-[#1E90FF]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UserPlus size={18} />
            Find Friends
          </button>
        </div>

        {/* =====================================================
            FRIENDS
        ====================================================== */}

        {activeTab === "friends" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Your Friends</h2>
            </div>

            {loadingFriends ? (
              <div className="flex justify-center py-20">
                <Loader2 size={30} className="animate-spin text-[#1E90FF]" />
              </div>
            ) : friends.length === 0 ? (
              <EmptyState
                icon={<UsersRound size={35} />}
                title="No friends yet"
                description="Find people and start building your FamFlix network."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            REQUESTS
        ====================================================== */}

        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-semibold mb-5">Friend Requests</h2>

            {loadingRequests ? (
              <div className="flex justify-center py-20">
                <Loader2 size={30} className="animate-spin text-[#1E90FF]" />
              </div>
            ) : requests.length === 0 ? (
              <EmptyState
                icon={<Clock size={35} />}
                title="No friend requests"
                description="When someone sends you a friend request, it will appear here."
              />
            ) : (
              <div className="space-y-3 max-w-2xl">
                {requests.map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            FIND FRIENDS
        ====================================================== */}

        {activeTab === "find" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Find Friends</h2>

            <p className="text-gray-400 mb-6">
              Search for people by their username.
            </p>

            <div className="max-w-2xl">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border border-gray-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#1E90FF] transition"
                />
              </div>

              {/* Search Results */}

              <div className="mt-4 space-y-3">
                {searching && (
                  <div className="flex justify-center py-8">
                    <Loader2
                      size={25}
                      className="animate-spin text-[#1E90FF]"
                    />
                  </div>
                )}

                {!searching &&
                  searchQuery.trim() &&
                  searchResults.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      No users found.
                    </div>
                  )}

                {!searching &&
                  searchResults.map((person) => {
                    const isOnline =
                      onlineUsers?.[person._id] ?? person.online ?? false;

                    return (
                      <div
                        key={person._id}
                        className="bg-[#141414] border border-gray-800 rounded-xl p-4 flex items-center gap-4"
                      >
                        {/* Avatar */}

                        <div className="relative">
                          <img
                            src={person.image}
                            alt={person.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />

                          {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full" />
                          )}
                        </div>

                        {/* User */}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {person.username}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {isOnline ? "Online" : "Offline"}
                          </p>
                        </div>

                        {/* Action */}

                        {renderSearchAction(person)}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =======================================================
          FRIEND PROFILE MODAL
      ======================================================== */}

      {selectedFriend && (
        <FriendProfile
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  );
};

export default Friends;
