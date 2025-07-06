import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../components/DeleteModal";
import { useNavigate } from "react-router-dom";
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
  return `${date.getUTCDate()} ${
    monthNames[date.getUTCMonth()]
  } ${date.getUTCFullYear()}`;
}

const WatchList = () => {
  const { removeFromWatchList } = useAuthUserStore();
  const navigate = useNavigate();
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

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
        setLoading(false);
      }
    };
    getWatchList();
  }, []);

  async function handleDelete(entry) {
    const promise = axios.delete(
      `/api/v1/watchlist/movie/${entry.id}`
    );
    toast.promise(promise, {
      loading: "Deleteing...",
      success: "Deleted from Watchlist!",
      error: "Can't to Watchlist.",
    });
    try {
      await promise;
      setWatchList((prev) =>
        prev.filter((item) => item.id !== entry.id)
      );
      removeFromWatchList(entry.id);

      closeModal();
    } catch (error) {
      toast.error(
        "Failed to delete the item",
        error.message
      );
    }
  }

  async function handleClear() {
    const promise = axios.delete(
      "/api/v1/watchlist/movies/clear"
    );
    toast.promise(promise, {
      loading: "Clearing...",
      success: "Watchlist Cleared!",
      error: "Can't Clear Watchlist.",
    });
    try {
      await promise;
      setWatchList([]);
    } catch (error) {
      console.error(
        "Error clearing watch list:",
        error.message
      );
    }
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">
            Loading Watchlist...
          </h1>
        </div>
      </div>
    );
  }

  if (watchList?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="font-bold text-center mb-8 text-3xl">
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
      <div className="max-w-6xl mx-auto px-4 md:py-8 py-4">
        <ArrowLeftIcon
          onClick={() => navigate(-1)}
          className="size-8 cursor-pointer"
        />
        <h1 className="font-bold text-center mb-6 text-3xl">
          Watch List
        </h1>

        <div className="flex justify-between items-center">
          <h2
            className="text-red-500 inline font-semibold text-lg cursor-pointer px-2 mb-4"
            onClick={() => {
              openModal("Clear all Watchlist");
              setDeleteItemId("clear-history");
            }}
          >
            Clear all
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {watchList.map((entry) => (
            <div
              key={entry?._id}
              className="bg-gray-800 p-4 rounded flex items-center justify-between hover:bg-gray-700 transition hover:scale-105"
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
                <Trash
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
          title="Delete from Watchlist"
          message={`Are you sure you want to remove "${selectedItem?.title}"?`}
        />
      )}
      {deleteItemId === "clear-history" && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={() => handleClear(selectedItem)}
          title="Clear Watchlist"
          message={`Are you sure you want to clear all Watchlist?`}
        />
      )}
    </div>
  );
};

export default WatchList;
