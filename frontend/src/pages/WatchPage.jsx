import { useParams, Link, useLocation } from "react-router-dom";
import { isIOS } from "react-device-detect";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Reviews from "../components/Reviews";
import {
  BookmarkCheck,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import toast from "react-hot-toast";
import formatReleaseDate from "../utils/formateDate";
import TvEpisodes from "../components/TvEpisodes";
import useWatchlist from "../hooks/useWatchlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const WatchPage = () => {
  const { id, category } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Local state
  const [tab, setTab] = useState("stream");
  const [showEpisodes, setShowEpisodes] = useState(true);
  const [trailers, setTrailers] = useState([]);
  const [currTrailersIdx, setCurrTrailersIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const sliderRef = useRef(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [episodeNumber, setEpisodeNumber] = useState(null);
  const [seasonNumber, setSeasonNumber] = useState(null);

  //  Get current watchlist from TanStack Query
  const { data: watchlist = [], refetch } = useWatchlist();

  //  Mutations: Add and Remove Watchlist
  const addToWatchlistMutation = useMutation({
    mutationFn: async () => axios.post(`/api/v1/watchlist/${category}/${id}`),
    onSuccess: () => {
      toast.success("Added to Watchlist!");
      queryClient.invalidateQueries(["watchlist"]);
      setIsBookmarked(true);
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error("Already in watchlist.");
      } else {
        toast.error("Failed to add to watchlist.");
        console.error(error);
      }
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async () => axios.delete(`/api/v1/watchlist/movie/${id}`),
    onSuccess: () => {
      toast.success("Removed from Watchlist!");
      queryClient.invalidateQueries(["watchlist"]);
      setIsBookmarked(false);
    },
    onError: () => {
      toast.error("Failed to remove from watchlist.");
    },
  });

  //  Toggle bookmark handler
  const handleToggleWatchlist = () => {
    if (isBookmarked) {
      removeFromWatchlistMutation.mutate();
    } else {
      addToWatchlistMutation.mutate();
    }
  };

  //  Refetch watchlist when page mounts or route changes
  useEffect(() => {
    refetch();
  }, [refetch, location.pathname]);

  //  Determine bookmark state from watchlist
  useEffect(() => {
    const bookmarked = watchlist?.some(
      (item) => String(item.id) === id && item.type === category
    );
    setIsBookmarked(bookmarked);
  }, [watchlist, id, category]);

  //  Record watch history
  useEffect(() => {
    axios
      .post(`/api/v1/watchhistory/setcontent`, { id, category })
      .catch(() => {});
  }, [id, category]);

  //  Fetch trailers
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${category}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch {
        setTrailers([]);
      }
    };
    getTrailers();
  }, [category, id]);

  //  Fetch similar
  useEffect(() => {
    const getSimilar = async () => {
      try {
        const res = await axios.get(`/api/v1/${category}/${id}/similar`);
        setSimilar(res.data.content);
      } catch {
        setSimilar([]);
      }
    };
    getSimilar();
  }, [category, id]);

  //  Fetch content details
  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/${category}/${id}/details`);
        setContent(res.data.details);
      } catch {
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    getMovieDetails();
  }, [category, id]);

  // Fetch cast/credits
  useEffect(() => {
    const getMovieCredits = async () => {
      try {
        const res = await axios.get(`/api/v1/${category}/credits/${id}`);
        setCast(res.data.casts);
      } catch {
        setCast([]);
      }
    };
    getMovieCredits();
  }, [category, id]);

  //  Scrolling functions
  const scrollLeft = () =>
    sliderRef.current?.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  const scrollRight = () =>
    sliderRef.current?.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });

  //  Episode setter
  function setData(data) {
    setSeasonNumber(parseInt(data.showSeason));
    setEpisodeNumber(parseInt(data.showEpisode));
  }

  //  Loading skeleton
  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );

  //  Content not found
  if (!content)
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <h2 className="text-2xl sm:text-4xl font-bold text-center">
          Content not found 😥
        </h2>
      </div>
    );

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container h-full">
        <Navbar />

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-2 mt-8">
          {["stream", "trailer"].map((key) => (
            <button
              key={key}
              className={`py-2 px-4 rounded ${
                tab === key
                  ? key === "stream"
                    ? "bg-blue-500"
                    : "bg-red-500/80"
                  : "bg-gray-800 text-gray-300"
              } hover:opacity-90`}
              onClick={() => {
                setTab(key);
                setCurrTrailersIdx(0);
              }}
            >
              {key === "stream" ? "Stream" : "Trailers"}
            </button>
          ))}
        </div>

        {/* Player Section */}
        <div className=" mb-8 p-2 sm:px-10 md:px-32">
          {tab === "trailer" ? (
            trailers.length > 0 ? (
              <>
                <div className="flex justify-between items-center my-4 px-4">
                  <button
                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded disabled:opacity-50"
                    disabled={currTrailersIdx === 0}
                    onClick={() => setCurrTrailersIdx((i) => i - 1)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded disabled:opacity-50"
                    disabled={currTrailersIdx === trailers.length - 1}
                    onClick={() => setCurrTrailersIdx((i) => i + 1)}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                <ReactPlayer
                  controls
                  width="100%"
                  height="90%"
                  className="mx-auto aspect-video rounded-lg overflow-hidden"
                  url={`https://www.youtube.com/embed/${
                    trailers[currTrailersIdx]?.key || ""
                  }`}
                />
              </>
            ) : (
              <p className="text-center mt-6 text-lg text-gray-400">
                No trailers available for {content?.title || content?.name}
              </p>
            )
          ) : (
            <div className="relative w-full h-full mb-4">
              <iframe
                src={
                  category === "movie"
                    ? isIOS
                      ? `https://vidsrc.icu/embed/movie/${id}`
                      : `https://vidsrc.ru/movie/${id}`
                    : isIOS
                    ? `https://vidsrc.icu/embed/tv/${id}/${seasonNumber}/${episodeNumber}`
                    : `https://vidsrc.ru/tv/${id}/${seasonNumber}/${episodeNumber}`
                }
                width="95%"
                height="90%"
                referrerPolicy="origin"
                allowFullScreen
                className="block aspect-video mx-auto rounded mt-4"
              ></iframe>
            </div>
          )}
          <div className="mb-4">
            <p className="md:px-13 px-2 pt-2 text-sm sm:text-xl italic">
              Use Brave browser for no ads. 😎
            </p>
            <p className="md:px-13 px-2 text-sm sm:text-lg italic">
              Report any broken link. 🥲
            </p>
          </div>

          {/* TV Episodes */}
          {category === "tv" && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowEpisodes((prev) => !prev)}
                className={` ${
                  showEpisodes ? "bg-blue-500/90" : "bg-gray-500"
                } hover:bg-blue-600 text-white rounded px-4 py-2`}
              >
                {showEpisodes ? "Hide Episodes" : "Show Episodes"}
              </button>
              {showEpisodes && (
                <TvEpisodes
                  id={content.id}
                  onSetData={setData}
                  seasons={content.seasons}
                />
              )}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="flex flex-col md:flex-row px-4 items-center justify-between gap-10 max-w-6xl mx-auto">
          <div>
            <h2 className="text-2xl sm:text-5xl font-bold">
              {content?.title || content?.name}
            </h2>
            <p className="text-gray-400 italic">{content?.tagline}</p>

            {/* ✅ Bookmark Button */}
            <button
              className="ml-auto mt-2 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-sm sm:text-2xl text-white px-4 sm:px-8 py-2 rounded"
              onClick={handleToggleWatchlist}
              disabled={
                addToWatchlistMutation.isLoading ||
                removeFromWatchlistMutation.isLoading
              }
            >
              {isBookmarked ? (
                <BookmarkCheck className="size-6" />
              ) : (
                <BookmarkPlus className="size-6" />
              )}
            </button>

            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}
            </p>

            {/* Genres */}
            <p className="mt-2 text-[#1E90FF] text-md font-semibold md:text-xl">
              Genres:
              <span className="text-gray-400 text-sm md:text-lg ml-2">
                {content?.genres?.map((g, i) => (
                  <span key={g.id}>
                    <Link
                      to={`/genre/${category}/${g.id}/${g.name}`}
                      className="hover:underline"
                    >
                      {g.name}
                    </Link>
                    {i < content.genres.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </p>

            {/* Casts */}
            <p className="text-[#1E90FF] text-md font-semibold md:text-xl mt-2">
              Casts:{" "}
              <span className="text-gray-400 text-sm md:text-lg">
                {cast
                  .slice(0, 10)
                  .map((c) => c.name)
                  .join(", ")}
              </span>
            </p>

            {/* Overview */}
            <p className="text-[#1E90FF] text-md font-semibold md:text-xl mt-2">
              Overview:
            </p>
            <p className="sm:text-xl text-md">{content?.overview}</p>
          </div>
        </div>

        {/* Poster */}
        <div className="max-w-6xl mx-auto mt-4 px-4">
          <p className="text-[#1E90FF] text-xl font-semibold">Poster:</p>
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="poster img"
            className="h-50 w-40 md:h-100 md:w-80 mt-2 md:max-h-[700px] mx-auto rounded"
          />
        </div>

        {/* Reviews */}
        <Reviews id={id} category={category} />

        {/* Similar Content */}
        {similar?.length > 0 ? (
          <div className="mt-12 max-w-5xl px-4 mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">
              Similar Movies / TV Shows
            </h3>
            <div
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 group"
              ref={sliderRef}
            >
              {similar.map((item) => (
                <Link
                  key={item.id}
                  to={`/watch/${category}/${item.id}`}
                  className="w-30 md:w-52 flex-none"
                >
                  <img
                    src={SMALL_IMG_BASE_URL + item.poster_path}
                    alt="poster img"
                    className="w-full h-auto rounded-md"
                  />
                  <h4 className="mt-2 text-sm md:text-lg font-semibold">
                    {item.title || item.name}
                  </h4>
                </Link>
              ))}
              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-[#1E90FF] text-white rounded-full"
                onClick={scrollLeft}
              />
              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-[#1E90FF] text-white rounded-full"
                onClick={scrollRight}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            No similar content found.
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
// `https://vidsrc.icu/embed/movie/${id}`
// `https://vidsrc.icu/embed/tv/${id}/${seasonNumber}/${episodeNumber}`
