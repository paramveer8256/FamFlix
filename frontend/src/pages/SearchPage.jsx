import React, { useState, useEffect } from "react";
import { useContentStore } from "../store/content.js";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { Link } from "react-router-dom";
import SearchSkeleton from "../components/skeletons/SearchSkeleton.jsx";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { setContentType } = useContentStore();

  const handleClick = (tab) => {
    setActiveTab(tab);
    setContentType(tab);
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchSearchResults = async (currentPage) => {
    if (loading || !hasMore || !searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/search/${activeTab}/${searchQuery}?page=${currentPage}`
      );

      let newResults = res.data?.content || [];

      // Filter duplicates and people without images
      // if (activeTab === "person") {
      //   const uniqueByName = {};
      //   newResults.forEach((item) => {
      //     if (
      //       item.profile_path &&
      // !uniqueByName[item.name]
      //     ) {
      //       uniqueByName[item.name] = item;
      //     }
      //   });
      //   newResults = Object.values(uniqueByName)
      //     .sort((a, b) => b.popularity - a.popularity)
      //     .slice(0, 12);
      // }

      setSearchResults((prev) => [...prev, ...newResults]);
      setPage((prev) => prev + 1);

      if (currentPage >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching results. Please try again."
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    fetchSearchResults(1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        fetchSearchResults(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore]);

  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 mb-4">
          {["movie", "tv", "person"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded ${
                activeTab === tab
                  ? tab === "movie"
                    ? "bg-blue-500"
                    : tab === "tv"
                    ? "bg-green-500"
                    : "bg-red-500/80"
                  : "bg-gray-800 text-gray-300"
              } text-white hover:scale-105 transition`}
              onClick={() => handleClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search for a ${activeTab}`}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Search className="size-6" />
          </button>
        </form>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((item) => {
            const imagePath =
              activeTab === "person"
                ? item?.profile_path
                : item?.poster_path;
            const nameOrTitle = item?.title || item?.name;

            if (!imagePath) return null;

            const linkTo =
              activeTab === "person"
                ? `/actor/movie/${item?.id}/${item?.name}`
                : `/watch/${activeTab}/${item?.id}`;

            const year =
              activeTab === "movie"
                ? item?.release_date?.split("-")[0]
                : item?.first_air_date?.split("-")[0];

            return (
              <Link
                to={linkTo}
                key={item?.id}
                className="bg-gray-800 p-2 rounded block hover:bg-gray-700 transition hover:scale-105"
              >
                <img
                  src={ORIGINAL_IMG_BASE_URL + imagePath}
                  alt={nameOrTitle}
                  className="w-full h-auto rounded"
                />
                <h2 className="mt-2 text-sm sm:text-xl font-bold text-center">
                  {nameOrTitle} {year && `(${year})`}
                </h2>
              </Link>
            );
          })}
        </div>

        {/* No Results Found
        {!loading &&
          searchResults.length === 0 &&
          searchQuery.trim() && (
            <p className="text-center text-gray-400 mt-10 text-xl">
              No results found for "{searchQuery}"
            </p>
          )} */}

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-4">
            <SearchSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
