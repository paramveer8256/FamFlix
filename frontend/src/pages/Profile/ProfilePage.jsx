import React, { use } from "react";
import {
  LogOut,
  Pencil,
  Film,
  Heart,
  Settings,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuthUserStore } from "../../store/authUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getUTCDate()} ${
    monthNames[date.getUTCMonth()]
  } ${date.getUTCFullYear()}`;
}

const ProfilePage = () => {
  const { user, logout, authCheck } = useAuthUserStore();
  const [watchHistory, setWatchHistory] = React.useState(
    []
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchWatchHistory = async () => {
      const response = await axios.get(
        "/api/v1/watchHistory/history"
      );
      if (response.data.success) {
        setWatchHistory(response.data.content);
      }
      console.log("Watch History:", response.data.content);
    };
    fetchWatchHistory();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user.image}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {user.username}
              </h1>
              <p className="text-gray-400 text-sm">
                {user.email}
              </p>
              <p className="text-sm text-blue-500 font-medium">
                Plan: Basic • Member since{" "}
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <button className="mt-4 sm:mt-0 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition flex items-center gap-2">
            <Pencil className="size-4" />
            Edit Profile
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <ProfileCard
            icon={<Film />}
            label="Watch History"
            onClick={() => navigate("/history")}
          />
          <ProfileCard
            icon={<Heart />}
            label="Watchlist"
            onClick={() => navigate("/watchlist")}
          />
          <ProfileCard
            icon={<Settings />}
            label="Settings"
            onClick={() => navigate("/settings")}
          />
          <ProfileCard
            icon={<LogOut />}
            label="Logout"
            onClick={logout}
          />
        </div>

        {/* Optional: Add more sections here */}
        {/* <Recommendations /> */}
        {/* <AccountDetails /> */}
        <div className="bg-gray-800 p-4  md:p-6   rounded-lg">
          <h2 className="font-bold pb-6 text-2xl">
            Recent Activity
          </h2>

          {watchHistory.map((entry) => (
            <div
              key={entry?._id}
              className="bg-gray-800 p-4 mb-2 border-blue-500/60 rounded flex border-2 items-center justify-between hover:bg-gray-700 transition hover:scale-105"
            >
              <Link
                to={`/watch/${entry?.type}/${entry?.id}`}
                className="flex flex-grow items-start gap-4"
              >
                <img
                  src={ORIGINAL_IMG_BASE_URL + entry?.image}
                  alt={entry?.title}
                  className="size-10 md:size-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm">
                    {entry?.title}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(entry?.created)}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2 ml-4">
                <span
                  className={`py-2 px-3 min-w-20 text-center rounded-full text-sm ${
                    entry?.type === "movie"
                      ? "bg-blue-600"
                      : entry?.type === "tv"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {entry?.type[0].toUpperCase() +
                    entry?.type.slice(1)}
                </span>
              </div>
            </div>
          ))}
          {watchHistory.length === 0 && (
            <p className="text-gray-400">
              No recent activity to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800 hover:bg-gray-700 transition p-4 rounded flex flex-col items-center justify-center text-center"
  >
    <div className="mb-2 text-blue-400">{icon}</div>
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

export default ProfilePage;
