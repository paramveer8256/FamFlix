import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthUserStore } from "../store/authUser";

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
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

const WatchList = () => {
  const { authCheck } = useAuthUserStore();
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading flag

  useEffect(() => {
    const getWatchList = async () => {
      try {
        const res = await axios.get(
          `/api/v1/watchlist/movies`
        );
        setWatchList(res.data.content);
      } catch (error) {
        console.log(error.response?.data?.message);
        setWatchList([]);
      } finally {
        setLoading(false); // ✅ hide loader
      }
    };
    getWatchList();
  }, []);

  async function handleDelete(entry) {
    try {
      await axios.delete(
        `/api/v1/watchlist/movie/${entry.id}`
      );
      setWatchList((prev) =>
        prev.filter((item) => item.id !== entry.id)
      );
      toast.success("Item deleted successfully");
      authCheck();
    } catch (error) {
      toast.error("Failed to delete the item");
    }
  }

  async function handleClear() {
    try {
      await axios.delete("/api/v1/watchlist/movies/clear");
      setWatchList([]);
      toast.success("Watch list cleared successfully");
    } catch (error) {
      console.error(
        "Error clearing watch list:",
        error.message
      );
    }
  }

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Loading Watchlist...</h1>
        </div>
      </div>
    );
  }

  // ✅ Show empty state only after loading
  if (watchList?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className=" font-bold text-center mb-8 text-3xl">
            Watch List
          </h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No Watch list found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-bold text-center mb-6 text-3xl">
          Watch List
        </h1>
        <div>
          <h2
            className="text-red-500 font-semibold text-lg cursor-pointer px-2 mb-2"
            onClick={handleClear}
          >
            Clear all
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchList.map((entry) => (
            <Link
              key={entry?._id}
              to={`/watch/${entry?.type}/${entry?.id}`}
              className="bg-gray-800 p-4 rounded flex items-start hover:bg-gray-700 transition hover:scale-105"
            >
              <img
                src={ORIGINAL_IMG_BASE_URL + entry?.image}
                alt="poster image"
                className="size-10 md:size-16 rounded object-cover mr-4 flex-shrink-0"
              />
              <div className="flex flex-col flex-grow">
                <span className="text-white font-semibold text-sm">
                  {entry?.title}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(entry?.created)}
                </span>
              </div>
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
              <Trash
                className="size-5 ml-4 flex-shrink-0 cursor-pointer hover:fill-red-500 hover:text-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(entry);
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchList;
