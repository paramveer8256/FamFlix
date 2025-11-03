import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../components/DeleteModal";
import { useAuthUserStore } from "../store/authUser";
import useWatchlist from "../hooks/useWatchlist";
import { useQueryClient, useMutation } from "@tanstack/react-query";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { removeFromWatchList } = useAuthUserStore();
  const { data: watchlist = [], isLoading, isError, refetch } = useWatchlist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

  //  Delete single item mutation
  const deleteMutation = useMutation({
    mutationFn: async (entry) => {
      return axios.delete(`/api/v1/watchlist/movie/${entry.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist"]);
      toast.success("Deleted from Watchlist!");
      removeFromWatchList(selectedItem?.id);
      closeModal();
    },
    onError: () => toast.error("Failed to delete item."),
  });

  //  Clear all mutation
  const clearMutation = useMutation({
    mutationFn: async () => axios.delete("/api/v1/watchlist/movies/clear"),
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist"]);
      toast.success("Watchlist Cleared!");
      closeModal();
    },
    onError: () => toast.error("Failed to clear watchlist."),
  });

  const openModal = (item, action) => {
    setSelectedItem(item);
    setDeleteAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setDeleteAction(null);
  };

  const handleDelete = () => deleteMutation.mutate(selectedItem);
  const handleClear = () => clearMutation.mutate();

  //  Loading & Error states from React Query
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Loading Watchlist...</h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Failed to load watchlist 😞
          </h1>
          <button
            onClick={refetch}
            className="mt-4 bg-blue-600 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ArrowLeftIcon
            onClick={() => navigate(-1)}
            className="size-8 cursor-pointer mb-4"
          />
          <h1 className="font-bold text-center mb-8 text-3xl">Watch List</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No Watchlist found 😥</p>
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
        <h1 className="font-bold text-center mb-6 text-3xl">Watch List</h1>

        <div className="flex justify-between items-center">
          <h2
            className="text-red-500 inline font-semibold text-lg cursor-pointer px-2 mb-4"
            onClick={() => openModal(null, "clear")}
          >
            Clear all
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {watchlist.map((entry) => (
            <div
              key={entry?.id}
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
                  {entry?.type[0].toUpperCase() + entry?.type.slice(1)}
                </span>
                <Trash
                  className="size-5 cursor-pointer hover:fill-red-500 hover:text-gray-100"
                  onClick={() => openModal(entry, "delete")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation modals */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={deleteAction === "clear" ? handleClear : handleDelete}
        title={
          deleteAction === "clear" ? "Clear Watchlist" : "Delete from Watchlist"
        }
        message={
          deleteAction === "clear"
            ? "Are you sure you want to clear all items from your Watchlist?"
            : `Are you sure you want to remove "${selectedItem?.title}"?`
        }
      />
    </div>
  );
};

export default WatchList;
