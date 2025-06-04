import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { Link } from "react-router-dom";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton.jsx";
import { EllipsisVertical } from "lucide-react";
import { useContentStore } from "../store/content.js";
import {
  Bookmark,
  BookmarkCheck,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const GenrePage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [bookmarkedIds, setBookmarkedIds] = useState(
    new Set()
  );
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [content, setContent] = useState(null);
  const { contentType, setContentType } = useContentStore();
  const { id, genreName } = useParams();

  const fetchGenreResults = async (currentPage) => {
    if (loading || !hasMore) return;
    setActiveTab("movie");
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/movie/genre/${id}?page=${currentPage}`
      );
      const newResults = res.data.content;

      setSearchResults((prev) => [...prev, ...newResults]);
      setPage((prev) => prev + 1);

      if (currentPage >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      if (error.response.status === 404)
        toast.error(
          "Atleast spell the word properly bruhh 😑"
        );
      else if (error.response.status === 500)
        toast.error(
          "Internal Server Error. Please try again later."
        );
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
  }, [page, loading, hasMore, activeTab]);

  // GET MOVIE DETAILS
  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(() => true);
      try {
        const res = await axios.get(
          `/api/v1/${contentType}/${id}/details`
        );
        setContent(res.data.details);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
        }
      } finally {
        setLoading(() => false);
      }
    };
    getMovieDetails();
  }, [contentType, id]);
  function handleClickBookmark(id) {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        {/* Tab Switcher */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="text-2xl font-semibold text-gray-300">
            Genre:
          </div>
          <button
            className={`py-1 px-4 rounded ${
              activeTab === "movie"
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-blue-600`}
          >
            {genreName}
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((item) => {
            if (!item?.poster_path && !item?.profile_path)
              return null;

            const imagePath =
              activeTab === "person"
                ? item?.profile_path
                : item?.poster_path;

            const nameOrTitle = item?.title || item?.name;

            return activeTab === "person" ? (
              <div
                key={`${item?.id}-${
                  item?.media_type ||
                  item?.title ||
                  item?.name
                }`}
                className="bg-gray-800 p-2 rounded"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={ORIGINAL_IMG_BASE_URL + imagePath}
                    alt={item?.name}
                    className="max-h-96 rounded mx-auto"
                  />
                  <h2 className="mt-2 text-xl font-bold">
                    {item?.name}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div
                  key={`${item?.id}-${
                    item?.media_type ||
                    item?.title ||
                    item?.name
                  }`}
                  className="absolute top-3 right-3 bg-gray-900 py-1 px-1 rounded z-50"
                >
                  <button
                    onClick={() =>
                      handleClickBookmark(item?.id)
                    }
                    className="group relative"
                  >
                    {bookmarkedIds.has(item?.id) ? (
                      <BookmarkCheck className="text-gray-100 size-7 md:size-9 cursor-pointer" />
                    ) : (
                      <BookmarkPlus className="text-gray-100 size-7 md:size-9 cursor-pointer" />
                    )}
                    <span className="absolute top-12  -left-19 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs px-2 py-1 rounded z-50">
                      {bookmarkedIds.has(item?.id)
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"}
                    </span>
                  </button>
                </div>
                <Link
                  key={`${item?.id}-${
                    item?.media_type ||
                    item?.title ||
                    item?.name
                  }`}
                  to={`/watch/movie/${item?.id}`}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700 transition hover:scale-105"
                >
                  <img
                    src={ORIGINAL_IMG_BASE_URL + imagePath}
                    alt={nameOrTitle}
                    className="w-full h-auto rounded "
                  />

                  <div className="flex justify-between items-center">
                    <h2 className="mt-2 text-sm sm:text-xl font-bold">
                      {nameOrTitle}
                    </h2>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-8">
            <WatchPageSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
