import React, { useState, useEffect, useRef } from "react";
import AnimeNav from "../../components/AnimeNav.jsx";
import {
  Search,
  BookmarkCheck,
  BookmarkPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchSkeleton from "../../components/skeletons/SearchSkeleton.jsx";
import { useAuthUserStore } from "../../store/authUser.js";

const AnimeSearchPage = () => {
  const [bookmarkedIds, setBookmarkedIds] = useState(
    new Set()
  );
  const loadCount = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const resultsRef = useRef(null); // 👈 Ref to scroll to

  const { user, updateWatchList } = useAuthUserStore();

  useEffect(() => {
    if (user?.watchList) {
      const ids = new Set(
        user.watchList.map((item) => item.id)
      );
      setBookmarkedIds(ids);
    }
  }, [user]);

  const handleAddToWatchlist = async (
    itemId,
    title,
    posterPath
  ) => {
    const promise = axios.post(
      `/api/v1/watchlist/movie/${itemId}`
    );
    toast.promise(promise, {
      loading: "Adding...",
      success: "Added to watchlist!",
      error: "Error in adding to watchlist.",
    });

    try {
      const res = await promise;
      if (res.data.success) {
        setBookmarkedIds((prev) =>
          new Set(prev).add(itemId)
        );
        updateWatchList({
          id: itemId,
          type: "anime",
          title,
          image: posterPath,
          addedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Failed to add to watchlist", error);
    }
  };

  const fetchSearchResults = async (pageNumber = 1) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    loadCount.current++;
    try {
      const res = await axios.get(
        `/api/v1/anime/search/?q=${searchQuery.trim()}&page=${pageNumber}`
      );

      const newResults = res.data?.content || [];
      setSearchResults(newResults);
      setTotalPages(res.data?.totalPages || 1);
      setPage(pageNumber);

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching results."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchSearchResults(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) fetchSearchResults(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) fetchSearchResults(page - 1);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <AnimeNav />
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anime"
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
            <Search className="size-6" />
          </button>
        </form>

        {/* Results Grid */}
        <div
          ref={resultsRef}
          className=" lg:px-15 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 gap-4"
        >
          {searchResults.map((item) => {
            const linkTo = `/anime/watch/${item?.mal_id}`;
            const isBookmarked = bookmarkedIds.has(
              item?.mal_id
            );
            const image = item?.images?.jpg?.image_url;

            return (
              <div
                key={item?.mal_id}
                className="relative transform transition duration-300 hover:scale-105"
              >
                <Link
                  to={linkTo}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700"
                >
                  <div className="relative">
                    <img
                      src={image}
                      alt={
                        item?.title_english || item?.title
                      }
                      className="w-64 md:h-100 h-full rounded"
                    />
                    <button
                      disabled={isBookmarked}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isBookmarked) {
                          handleAddToWatchlist(
                            item?.mal_id,
                            item?.title_english ||
                              item?.title,
                            image
                          );
                        }
                      }}
                      className={`absolute top-2 right-2 group ${
                        isBookmarked
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      } p-2 rounded-2xl bg-black/70 backdrop-blur-lg`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="text-white size-7 md:size-9" />
                      ) : (
                        <BookmarkPlus className="text-white size-7 md:size-9" />
                      )}
                      <span className="absolute top-10 -left-16 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs px-2 py-1 rounded">
                        {isBookmarked
                          ? "Already in Watchlist"
                          : "Add to Watchlist"}
                      </span>
                    </button>
                  </div>
                  <h2 className="mt-2 text-sm sm:text-xl font-bold text-center">
                    {item?.title_english || item?.title}{" "}
                    {item?.year}
                  </h2>
                </Link>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        {searchResults.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        {/* Loading */}

        {loading && loadCount.current < 2 && (
          <SearchSkeleton />
        )}
      </div>
    </div>
  );
};

export default AnimeSearchPage;
