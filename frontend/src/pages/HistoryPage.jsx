import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../components/DeleteModal";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useSearchHistory from "../hooks/useSearchHistory";

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

const HistoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Get search history from TanStack Query
  const {
    data: searchHistory = [],
    isLoading,
    isError,
    refetch,
  } = useSearchHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

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

  // ✅ Delete one mutation
  const deleteMutation = useMutation({
    mutationFn: async (entry) =>
      axios.delete(`/api/v1/search/history/${entry.id}`),
    onSuccess: () => {
      toast.success("Deleted from History!");
      queryClient.invalidateQueries(["search-history"]);
      closeModal();
    },
    onError: () => toast.error("Failed to delete item."),
  });

  // ✅ Clear all mutation
  const clearMutation = useMutation({
    mutationFn: async () => axios.delete(`/api/v1/search/history/clear`),
    onSuccess: () => {
      toast.success("History Cleared!");
      queryClient.invalidateQueries(["search-history"]);
      closeModal();
    },
    onError: () => toast.error("Failed to clear history."),
  });

  const handleDelete = () => deleteMutation.mutate(selectedItem);
  const handleClear = () => clearMutation.mutate();

  // ✅ Loading and Error UI
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Loading history...</h1>
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
            Failed to load history 😞
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

  // ✅ No history
  if (searchHistory.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ArrowLeftIcon
            onClick={() => navigate(-1)}
            className="size-8 cursor-pointer mb-4"
          />
          <h1 className="font-bold text-center mb-8 text-3xl">History</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No Search History Found</p>
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
        <h1 className="font-bold text-center mb-6 text-3xl">History</h1>

        <div className="flex justify-between items-center">
          <h2
            className="text-red-500 font-semibold text-lg cursor-pointer px-2 mb-4"
            onClick={() => openModal(null, "clear")}
          >
            Clear all
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchHistory.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 p-4 rounded flex items-center justify-between hover:bg-gray-700 transition hover:scale-105"
            >
              <Link
                to={
                  entry.searchType === "person"
                    ? `/actor/movie/${entry.id}/${entry.title}`
                    : `/watch/${entry.searchType}/${entry.id}`
                }
                className="flex flex-grow items-start gap-4"
              >
                <img
                  src={ORIGINAL_IMG_BASE_URL + entry.image}
                  alt={entry.title}
                  className="size-10 md:size-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm">
                    {entry.title}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(entry.created)}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2 ml-4">
                <span
                  className={`py-2 px-3 min-w-20 text-center rounded-full text-sm ${
                    entry.searchType === "movie"
                      ? "bg-blue-600"
                      : entry.searchType === "tv"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {entry.searchType[0].toUpperCase() +
                    entry.searchType.slice(1)}
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

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={deleteAction === "clear" ? handleClear : handleDelete}
        title={
          deleteAction === "clear"
            ? "Clear Search History"
            : "Delete from History"
        }
        message={
          deleteAction === "clear"
            ? "Are you sure you want to clear all search history?"
            : `Are you sure you want to remove "${selectedItem?.title}"?`
        }
      />
    </div>
  );
};

export default HistoryPage;
