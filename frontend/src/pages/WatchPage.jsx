import { useParams, Link } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Bookmark,
  BookmarkCheck,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactPlayer from "react-player";
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../utils/constants";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import toast from "react-hot-toast";
import { useAuthUserStore } from "../store/authUser";

function formatReleaseDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
const WatchPage = () => {
  const { user, authCheck } = useAuthUserStore();
  const [tab, setTab] = React.useState("stream");
  const { id, category } = useParams(); // Extract movie ID from URL
  const [trailers, setTrailers] = React.useState([]);
  const [currTrailersIdx, setCurrTrailersIdx] =
    React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [content, setContent] = React.useState({});
  const { contentType, setContentType } = useContentStore();
  const [similar, setSimilar] = React.useState([]);
  const sliderRef = useRef(null);
  const [isBookmarked, setIsBookmarked] =
    React.useState(false);


  useEffect(() => {
    setContentType(category);
  }, [category, setContentType]);

  React.useEffect(() => {
    if (user?.watchList) {
      const bookmarked = user.watchList.some(
        (item) =>
          String(item.id) === id && item.type === "movie"
      );
      setIsBookmarked(bookmarked);
    }
  }, [user, id]);
  const handleAddToWatchlist = async () => {
    try {
      const res = await axios.get(
        `/api/v1/watchlist/movie/${id}`
      );
      if (res.data.success) {
        setIsBookmarked(true);
        toast.success("Added to Watchlist");
      }
      authCheck();
    } catch (error) {
      console.error("Failed to add to watchlist", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add to watchlist"
      );
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  // GET TRAILERS
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(
          `/api/v1/${contentType}/${id}/trailers`
        );
        setTrailers(res.data.trailers);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
      }
    };
    getTrailers();
  }, [contentType, id]);

  // GET SIMILAR MOVIES
  useEffect(() => {
    const getSimilar = async () => {
      try {
        const res = await axios.get(
          `/api/v1/${contentType}/${id}/similar`
        );
        setSimilar(res.data.content);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilar([]);
        }
      }
    };
    getSimilar();
  }, [contentType, id]);

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

  function handleNext() {
    if (currTrailersIdx < trailers.length - 1)
      setCurrTrailersIdx(currTrailersIdx + 1);
  }
  function handlePrev() {
    if (currTrailersIdx > 0)
      setCurrTrailersIdx(currTrailersIdx - 1);
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  if (!content) {
    return (
      <div className="h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }
  const handleClick = (newTab) => {
    setTab(newTab);
    setCurrTrailersIdx(0); // Reset trailer index when switching tabs
  };
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container h-full">
        <Navbar />
        <div className="flex justify-center gap-3 mb-2">
          <button
            className={`py-2 px-4 rounded ${
              tab === "stream"
                ? "bg-blue-500 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-blue-600`}
            onClick={() => handleClick("stream")}
          >
            Stream
          </button>
          <button
            className={`py-2 px-4 rounded ${
              tab === "trailers"
                ? "bg-red-500/80 text-white"
                : "bg-gray-800 text-gray-300"
            } hover:bg-red-500/90`}
            onClick={() => handleClick("trailers")}
          >
            Trailers
          </button>
        </div>
        {trailers?.length > 0 &&
          (tab === "trailers" ? (
            <div className="flex justify-between items-center my-4 px-4">
              <button
                className={`bg-gray-500/70 hover:bg-gray-500  text-white py-2 px-4 rounded
              ${
                currTrailersIdx === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
              `}
                disabled={currTrailersIdx === 0}
                onClick={handlePrev}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded
              ${
                currTrailersIdx === trailers?.length - 1
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
              `}
                disabled={
                  currTrailersIdx === trailers.length - 1
                }
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : null)}

        <div
          className={` ${
            trailers?.length === 0 ? null : "aspect-video"
          }  mb-8  p-2 sm:px-10 md:px-32 `}
        >
          {trailers?.length > 0 &&
            (tab === "trailers" ? (
              <ReactPlayer
                controls={true}
                width={"100%"}
                height={"90%"}
                className="mx-auto overflow-hidden rounded-lg"
                url={`https://www.youtube.com/embed/${
                  trailers[currTrailersIdx]?.key || ""
                }`}
              />
            ) : (
              <div className="relative w-full h-full mb-4">
                {/* Mobile iframe */}
                <iframe
                  src={`https://vidsrc.icu/embed/movie/${id}`}
                  width="100%"
                  height="100%"
                  referrerPolicy="origin"
                  allowFullScreen
                  className="block lg:hidden rounded-2xl mt-4"
                ></iframe>

                {/* Desktop iframe */}
                <iframe
                  src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`}
                  width="100%"
                  height="80%"
                  allowFullScreen
                  className="lg:block hidden rounded-2xl mt-4"
                ></iframe>
                <p className="px-2 pt-2 text-sm sm:text-xl italic">
                  Use Brave browser for no ads.😎
                </p>
                <p className="px-2 text-sm sm:text-lg italic">
                  Report any broken link.🥲
                </p>
              </div>
            ))}
          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-4">
              No trailers or media available for{" "}
              <span className="font-bold text-[#1E90FF]">
                {content?.title || content?.name}
              </span>
            </h2>
          )}
        </div>

        {/* movie details */}
        <div className="flex felx-col md:flex-row px-4 items-center justify-between gap-10 max-w-6xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>
            {/* Add the bookmark button here */}
            <button
              className=" ml-auto mt-2 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-sm sm:text-2xl text-white px-4 sm:px-8  py-2 rounded"
              onClick={handleAddToWatchlist}
            >
              {isBookmarked ? (
                <BookmarkCheck className="size-6" />
              ) : (
                <BookmarkPlus className="size-6" />
              )}
            </button>
            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date ||
                  content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600"> 18+</span>
              ) : (
                <span className="text-green-600">
                  {" "}
                  PG-13
                </span>
              )}{" "}
            </p>
            <p className="mt-4 sm:text-lg text-sm">
              {content?.overview}
            </p>
          </div>
          <img
            src={
              ORIGINAL_IMG_BASE_URL + content?.poster_path
            }
            alt="poster img"
            className="max-h-[1700px] md:max-h-[700px]  rounded-md overflow-hidden"
          />
        </div>

        {similar?.length > 0 && (
          <div className="mt-12 max-w-5xl px-4 mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">
              Similar Movies/Tv show
            </h3>
            <div
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 group"
              ref={sliderRef}
            >
              {similar.map((item) => (
                <Link
                  key={item.id}
                  to={`/watch/${category}/${item?.id}`}
                  className="w-52 flex-none"
                >
                  <img
                    src={
                      SMALL_IMG_BASE_URL + item?.poster_path
                    }
                    alt="poster img"
                    className="w-full h-auto rounded-md"
                  />
                  <h4 className="mt-2 text-lg font-semibold">
                    {item?.title || item?.name}
                  </h4>
                </Link>
              ))}
              <ChevronLeft
                className="absolute top-1/2  -translate-y-1/2 left-2 w-8 h-8 
              opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
              bg-[#1E90FF] text-white rounded-full"
                onClick={scrollLeft}
              />
              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 
              opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
              bg-[#1E90FF] text-white rounded-full"
                onClick={scrollRight}
              />
            </div>
          </div>
        )}
        {similar?.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No similar content found.
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
