import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { Link } from "react-router-dom";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton.jsx";
import SearchSkeleton from "../components/skeletons/SearchSkeleton.jsx";

const ActorMovies = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { id, name } = useParams();

  const fetchGenreResults = async (currentPage) => {
    if (loading || !hasMore) return;
    setActiveTab("movie");
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/movie/actor/${id}`
      );
      const newResults = res.data.content;
      console.log(newResults);
      setSearchResults((prev) => [...prev, ...newResults]);
      setPage((prev) => prev + 1);

      if (currentPage >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(
        "Internal Server Error. Please try again later.",
        error
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

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Tab Switcher */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="text-2xl font-semibold text-gray-300">
            Actor:
          </div>
          <button
            className={`py-1 text-lg px-4 rounded ${
              activeTab === "movie"
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-blue-600`}
          >
            {name}
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
              <Link
                key={`${item?.id}-${
                  item?.media_type ||
                  item?.title ||
                  item?.name
                }`}
                to={`/watch/${activeTab}/${item?.id}`}
                className="bg-gray-800 p-2 rounded block hover:bg-gray-700 transition"
              >
                <img
                  src={ORIGINAL_IMG_BASE_URL + imagePath}
                  alt={nameOrTitle}
                  className="w-full h-auto rounded"
                />
                <h2 className="mt-2 text-sm sm:text-xl font-bold">
                  {nameOrTitle}
                </h2>
              </Link>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div>
            <SearchSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorMovies;
