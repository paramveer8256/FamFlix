import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import { useContentStore } from "../store/content.js";
import SearchSkeleton from "../components/skeletons/SearchSkeleton.jsx";
import { useAuthUserStore } from "../store/authUser.js";

const GenrePage = () => {
  const { updateWatchList, user } = useAuthUserStore();
  const { category, id, genreName } = useParams();
  const { contentType } = useContentStore();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [content, setContent] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(
    new Set()
  );

  const fetchGenreResults = async (currentPage) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/${category}/genre/${id}?page=${currentPage}`
      );
      const newResults = res.data.content;
      setSearchResults((prev) => [...prev, ...newResults]);
      setPage((prev) => prev + 1);
      if (currentPage >= res.data.totalPages)
        setHasMore(false);
    } catch (error) {
      toast.error("Error loading data.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    fetchGenreResults(1);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        fetchGenreResults(page);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore]);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/v1/${contentType}/${id}/details`
        );
        setContent(res.data.details);
      } catch {
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [contentType, id]);

  useEffect(() => {
    if (user?.watchList) {
      const ids = new Set(
        user.watchList.map((item) => item.id)
      );
      setBookmarkedIds(ids);
    }
  }, [user]);

  const handleAddToWatchlist = async (
    movieId,
    movieTitle,
    posterPath
  ) => {
    const promise = axios.post(
      `/api/v1/watchlist/${category}/${movieId}`
    );
    toast.promise(promise, {
      loading: "Adding...",
      success: "Added to watchlist!",
      error: "Already in watchlist.",
    });

    try {
      const res = await promise;
      if (res.data.success) {
        setBookmarkedIds((prev) =>
          new Set(prev).add(movieId)
        );
        updateWatchList({
          id: movieId,
          type: category,
          title: movieTitle,
          image: posterPath,
          addedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Failed to add to watchlist", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="text-2xl font-semibold text-gray-300">
            Genre:
          </div>
          <button className="py-1 px-4 rounded bg-blue-500 text-white hover:bg-blue-600">
            {genreName}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((item) => {
            if (!item?.poster_path && !item?.profile_path)
              return null;
            const imagePath =
              item?.poster_path || item?.profile_path;
            const nameOrTitle = item?.title || item?.name;
            const isBookmarked = bookmarkedIds.has(
              item?.id
            );

            return (
              <div
                key={item?.id}
                className="relative transform transition-transform duration-300 hover:scale-105"
              >
                <Link
                  to={`/watch/${category}/${item?.id}`}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700"
                >
                  <div className="relative">
                    <img
                      src={
                        ORIGINAL_IMG_BASE_URL + imagePath
                      }
                      alt={nameOrTitle}
                      className="w-full h-auto rounded"
                    />
                    <button
                      disabled={isBookmarked}
                      onClick={(e) => {
                        e.preventDefault(); // prevent triggering Link
                        if (!isBookmarked) {
                          handleAddToWatchlist(
                            item?.id,
                            nameOrTitle,
                            item?.poster_path
                          );
                        }
                      }}
                      className={`absolute top-2 right-2 group ${
                        isBookmarked
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      } p-2 rounded-2xl bg-black/70 backdrop-blur-lg shadow-[0_0_8px_8px_rgba(0,0,0,0.7)] transition duration-300`}
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
                  <h2 className="mt-2 text-sm sm:text-xl font-bold">
                    {nameOrTitle}
                  </h2>
                </Link>
              </div>
            );
          })}
        </div>

        {!loading && searchResults.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No results found for this genre.
          </p>
        )}

        {loading && <SearchSkeleton />}
      </div>
    </div>
  );
};

export default GenrePage;
