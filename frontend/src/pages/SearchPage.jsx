import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Search,
  BookmarkCheck,
  BookmarkPlus,
  FilterIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { Link } from "react-router-dom";
import SearchSkeleton from "../components/skeletons/SearchSkeleton.jsx";
import { useAuthUserStore } from "../store/authUser.js";
import Note from "../components/Note.jsx";
const years = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
  2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008,
  2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
];
const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [bookmarkedIds, setBookmarkedIds] = useState(
    new Set()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState(false);
  const [syear, setYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
      `/api/v1/watchlist/${activeTab}/${itemId}`
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
          type: activeTab,
          title,
          image: posterPath,
          addedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Failed to add to watchlist", error);
    }
  };

  const handleClick = (tab) => {
    setActiveTab(tab);
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchSearchResults = async (currentPage) => {
    if (loading || !hasMore || !searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/search/${activeTab}/${searchQuery.trim()}?page=${currentPage}&year=${syear}`
      );
      let newResults = res.data?.content || [];

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
      if (currentPage >= res.data.totalPages)
        setHasMore(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching results."
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

  function handleFilter() {
    setFilter((prev) => !prev);
    setYear(null);
  }
  function handleYear(year) {
    setYear(year);
  }
  function handleModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-2">
          {["movie", "tv", "person"].map((tab) => {
            const isActive = activeTab === tab;
            const activeColor =
              tab === "movie"
                ? "bg-blue-500"
                : tab === "tv"
                ? "bg-green-500"
                : "bg-red-500";
            return (
              <button
                key={tab}
                disabled={tab === "person" ? filter : null}
                className={`py-2 px-4 rounded ${
                  isActive
                    ? activeColor
                    : "bg-gray-800 text-gray-300"
                } text-white hover:scale-105 transition`}
                onClick={() => handleClick(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center h-15 flex-wrap gap-4">
            <button
              disabled={activeTab === "person"}
              onClick={handleFilter}
              className={` ${
                filter ? "bg-blue-500" : "bg-gray-800"
              } py-2 px-4 rounded flex gap-1 items-center`}
            >
              Filter
              <FilterIcon className="size-4" />
            </button>
            {filter && (
              <>
                {" "}
                <p className="">Year:</p>
                <div className=" w-20 h-15 scrollbar-hide overflow-y-auto">
                  {years.map((year) => (
                    <button
                      onClick={() => handleYear(year)}
                      className={`${
                        syear === year
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      } px-3 mb-1 rounded`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-gray-800 p-1 rounded"
                  onClick={handleModal}
                >
                  Note!!
                </button>
                <Note
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  title="Note!!"
                  message="For using the Advance Filters you won't be to use search bar only the search button obviously for filters to work. Don't ask me how but this is how it works. Peace☮️"
                />
              </>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
        >
          <input
            type="text"
            // disabled={filter}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search for a ${activeTab}`}
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Search className="size-6" />
          </button>
        </form>

        <div className="lg:px-15 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 gap-4">
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
            const isBookmarked = bookmarkedIds.has(
              item?.id
            );

            return (
              <div
                key={item?.id}
                className="relative transform transition-transform duration-300 hover:scale-105"
              >
                <Link
                  to={linkTo}
                  className="bg-gray-800 p-2 rounded block hover:bg-gray-700"
                >
                  <div className="relative">
                    <img
                      src={
                        ORIGINAL_IMG_BASE_URL + imagePath
                      }
                      alt={nameOrTitle}
                      className="w-64 md:h-100 h-full rounded"
                    />
                    {activeTab !== "person" && (
                      <button
                        disabled={isBookmarked}
                        onClick={(e) => {
                          e.preventDefault();
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
                    )}
                  </div>
                  <h2 className="mt-2 text-sm sm:text-xl font-bold text-center">
                    {nameOrTitle} {year && `(${year})`}
                  </h2>
                </Link>
              </div>
            );
          })}
        </div>

        {loading && <SearchSkeleton />}
      </div>
    </div>
  );
};

export default SearchPage;
