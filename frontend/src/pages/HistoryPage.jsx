import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../utils/constants";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

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
const HistoryPage = () => {
  const [searchHistory, setSearchHistory] = React.useState(
    []
  );
  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const res = await axios.get(
          `/api/v1/search/history`
        );
        console.log(res.data.content);
        setSearchHistory(res.data.content);
      } catch (error) {
        error.response.data.message;
        console.log(error.response.data.message);
        setSearchHistory([]);
      }
    };
    getSearchHistory();
  }, []);
  async function handleDelete(entry) {
    try {
      await axios.delete(
        `/api/v1/search/history/${entry.id}`
      );
      setSearchHistory(
        searchHistory.filter((item) => item.id !== entry.id)
      );
      toast.success("Item deleted successfully");
    } catch (error) {
      error.message;
      toast.error("Failed to delete the item");
    }
  }
  if (searchHistory?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className=" font-bold text-center mb-8 text-3xl">
            Search History
          </h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">
              {" "}
              No Search history found
            </p>
          </div>
        </div>
      </div>
    );
  }
  async function handleClear() {
    try {
      await axios.delete("/api/v1/search/history/clear"); // Adjust URL if needed
      setSearchHistory([]); // Clear the local state too
      toast.success("History Clear Successfully");
    } catch (error) {
      console.error(
        "Error clearing history:",
        error.response?.data?.message || error.message
      );
    }
  }
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-bold text-center mb-6 text-3xl">
          Search History
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
          {searchHistory?.map((entry) => (
            <Link
              key={entry?._id}
              to={`/watch/${entry?.searchType}/${entry?.id}`}
              className="bg-gray-800 p-4 rounded flex items-start hover:bg-gray-700 transition"
            >
              <img
                src={ORIGINAL_IMG_BASE_URL + entry?.image}
                alt="poster image"
                className="size-10 md:size-16 rounded object-cover mr-4"
              />
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">
                  {entry?.title}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDate(entry?.created)}
                </span>
              </div>
              <span
                className={`py-2 px-3 min-w-20 text-center rounded-full text-sm ml-auto ${
                  entry?.searchType === "movie"
                    ? "bg-blue-600"
                    : entry?.searchType === "person"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {entry?.searchType[0].toUpperCase() +
                  entry?.searchType.slice(1)}
              </span>
              <Trash
                className="size-5 ml-4 cursor-pointer hover:fill-red-500 hover:text-gray-100"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when deleting
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

export default HistoryPage;
