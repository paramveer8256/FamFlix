import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../components/DeleteModal";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const res = await axios.get(
          `/api/v1/search/history`
        );
        setSearchHistory(res.data.content);
      } catch (error) {
        console.log(error.response?.data?.message);
        setSearchHistory([]);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };
    getSearchHistory();
  }, []);

  async function handleDelete(entry) {
    try {
      await axios.delete(
        `/api/v1/search/history/${entry.id}`
      );
      setSearchHistory((prev) =>
        prev.filter((item) => item.id !== entry.id)
      );
      toast.success("Item deleted successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to delete the item");
    }
  }

  async function handleClear() {
    try {
      await axios.delete("/api/v1/search/history/clear");
      setSearchHistory([]);
      toast.success("History cleared successfully");
    } catch (error) {
      console.error(
        "Error clearing history:",
        error.message
      );
    }
  }

  // ✅ Show loading
  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">
            Loading history...
          </h1>
        </div>
      </div>
    );
  }

  // ✅ Only show "No history" after loading
  if (searchHistory?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className=" font-bold text-center mb-8 text-3xl">
            History
          </h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">
              No Search history found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-2 pb-8">
        <ArrowLeftIcon
          onClick={() => navigate(-1)}
          className="size-8 cursor-pointer"
        />
        <h1 className="font-bold text-center mb-6 text-3xl">
          History
        </h1>
        <div className="flex justify-between items-center">
          <h2
            className="text-red-500 font-semibold text-lg cursor-pointer px-2 mb-2"
            onClick={() => {
              openModal("Clear all History");
              setDeleteItemId("clear-history");
            }}
          >
            Clear all
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchHistory.map((entry) => (
            <div
              key={entry?._id}
              className="bg-gray-800 p-4 rounded flex items-center justify-between hover:bg-gray-700 transition hover:scale-105"
            >
              <Link
                to={`/watch/${entry?.searchType}/${entry?.id}`}
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
                    entry?.searchType === "movie"
                      ? "bg-blue-600"
                      : entry?.searchType === "tv"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {entry?.searchType[0].toUpperCase() +
                    entry?.searchType.slice(1)}
                </span>
                <Trash
                  id="delete-item"
                  className="size-5 cursor-pointer hover:fill-red-500 hover:text-gray-100"
                  onClick={() => {
                    openModal(entry);
                    setDeleteItemId("delete-item");
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {deleteItemId === "delete-item" && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={() => handleDelete(selectedItem)}
          title="Delete from History"
          message={`Are you sure you want to remove "${selectedItem?.title}"?`}
        />
      )}
      {deleteItemId === "clear-history" && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={() => handleClear(selectedItem)}
          title="Clear Search History"
          message={`Are you sure you want to clear all search history?`}
        />
      )}
    </div>
  );
};

export default HistoryPage;
