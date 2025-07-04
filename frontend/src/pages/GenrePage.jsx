import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import { useContentStore } from "../store/content.js";
import SearchSkeleton from "../components/skeletons/SearchSkeleton.jsx";

const GenrePage = () => {
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

      if (currentPage >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      if (error.response?.status === 404)
        toast.error(
          "At least spell the word properly bruhh 😑"
        );
      else if (error.response?.status === 500)
        toast.error(
          "Internal Server Error. Please try again later."
        );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when genre ID changes
  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    fetchGenreResults(1);
  }, [id]);

  // Infinite scroll
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

  // Get Movie/TV Details
  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    getDetails();
  }, [contentType, id]);

  const handleClickBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        {/* Genre Header */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="text-2xl font-semibold text-gray-300">
            Genre:
          </div>
          <button className="py-1 px-4 rounded bg-blue-500 text-white hover:bg-blue-600">
            {genreName}
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((item) => {
            if (!item?.poster_path && !item?.profile_path)
              return null;

            const imagePath =
              item?.poster_path || item?.profile_path;
            const nameOrTitle = item?.title || item?.name;

            return (
              <div key={item?.id} className="relative">
                <div className="absolute top-3 right-3 bg-gray-900 py-1 px-1 rounded z-10">
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
                    <span className="absolute top-12 -left-20 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs px-2 py-1 rounded">
                      {bookmarkedIds.has(item?.id)
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"}
                    </span>
                  </button>
                </div>
                <Link
                  to={`/watch/${category}/${item?.id}`}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700 transition hover:scale-105"
                >
                  <img
                    src={ORIGINAL_IMG_BASE_URL + imagePath}
                    alt={nameOrTitle}
                    className="w-full h-auto rounded"
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

        {/* No Results Message */}
        {!loading && searchResults.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No results found for this genre.
          </p>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="mt-8">
            <SearchSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
