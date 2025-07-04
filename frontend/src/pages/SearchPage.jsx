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

      let newResults = res.data.content;
      // Apply filtering if tab is person
      if (activeTab === "person") {
        const uniqueByName = {};
        newResults.forEach((item) => {
          if (
            item.profile_path &&
            !uniqueByName[item.name]
          ) {
            uniqueByName[item.name] = item;
          }
        });
        newResults = Object.values(uniqueByName)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 12);
      }

      setSearchResults((prev) => [...prev, ...newResults]);
      setPage((prev) => prev + 1);

      if (currentPage >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(
          "At least spell the word properly bruhh 😑"
        );
      } else if (error.response?.status === 500) {
        toast.error(
          error.response.data.message ||
            "Internal Server Error. Please try again later."
        );
      }
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
  }, [page, loading, hasMore, searchQuery, activeTab]);

  // Clear results when search query changes
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
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "movie"
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-blue-600`}
            onClick={() => handleClick("movie")}
          >
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "tv"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-green-600`}
            onClick={() => handleClick("tv")}
          >
            TV Shows
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "person"
                ? "bg-red-500/80 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-red-500/90`}
            onClick={() => handleClick("person")}
          >
            Person
          </button>
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
            className="w-full p-2 bg-gray-800 text-white"
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Search className="size-6" />
          </button>
        </form>

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

            if (activeTab === "person") {
              return (
                <Link
                  to={`/actor/movie/${item?.id}/${item?.name}`}
                  key={item?.id}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700 transition hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        ORIGINAL_IMG_BASE_URL + imagePath
                      }
                      alt={item?.name}
                      className="max-h-96 rounded mx-auto"
                    />
                    <h2 className="mt-2 text-xl font-bold text-center">
                      {item?.name}
                    </h2>
                  </div>
                </Link>
              );
            } else if (activeTab === "movie") {
              return (
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
                    className="w-full h-auto rounded"
                  />
                  <h2 className="mt-2 text-sm sm:text-xl font-bold">
                    {nameOrTitle} (
                    {item?.release_date?.split("-")[0] ||
                      "NA"}
                    )
                  </h2>
                </Link>
              );
            } else {
              return (
                <Link
                  key={`${item?.id}-${
                    item?.media_type ||
                    item?.title ||
                    item?.name
                  }`}
                  to={`/watch/tv/${item?.id}`}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700 transition hover:scale-105"
                >
                  <img
                    src={ORIGINAL_IMG_BASE_URL + imagePath}
                    alt={nameOrTitle}
                    className="w-full h-auto rounded"
                  />
                  <h2 className="mt-2 text-sm sm:text-xl font-bold">
                    {nameOrTitle} (
                    {item?.first_air_date?.split("-")[0] ||
                      "NA"}
                    )
                  </h2>
                </Link>
              );
            }
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

export default SearchPage;
