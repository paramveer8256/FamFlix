import React from "react";
import axios from "axios";
import MovieSlider from "../../components/MovieSlider.jsx";
import Navbar from "../../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { Info, Play } from "lucide-react";
import packageJson from "../../../package.json";
import useGetTrendingContent from "../../hooks/useGetTrendingContent.jsx";
import {
  ORIGINAL_IMG_BASE_URL,
  MOVIE_CATEGORIES,
  TV_CATEGORIES,
} from "../../utils/constants.js";
import { useContentStore } from "../../store/content.js";
import useWatchStore from "../../store/watchStore";
import { toast as toastify } from "react-toastify";
import SplashScreen from "../../components/SplashScreen";

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();

  const { watchHistory } = useWatchStore();

  const [watchHistoryData, setWatchHistoryData] = React.useState([]);

  const [imgLoading, setImgLoading] = React.useState(true);

  const [showSplash, setShowSplash] = React.useState(() => {
    return localStorage.getItem("justLoggedIn") === "true";
  });

  // FETCH WATCH HISTORY FROM BACKEND
  React.useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await axios.get("/api/v1/watchHistory/history");

        if (response.data.success) {
          setWatchHistoryData(response.data.content);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchWatchHistory();
  }, []);

  // Splash screen
  React.useEffect(() => {
    if (showSplash) {
      const timeout = setTimeout(() => {
        setShowSplash(false);

        if (localStorage.getItem("justLoggedIn")) {
          const version = packageJson.version;

          toastify(
            <div className="text-sm">
              <p className="mb-2">
                👋 Hey! Dev here — I've added some awesome new social features!
                You can now find friends, send friend requests, view profiles,
                and chat in real time. 😎
              </p>

              <div className="flex justify-between items-center mt-2 text-sm">
                <a
                  href="/updates"
                  className="underline font-semibold hover:text-blue-600"
                >
                  View Full Updates →
                </a>

                <span className="opacity-70">v{version}</span>
              </div>
            </div>,
            {
              position: "bottom-left",
              theme: "light",
              autoClose: 20000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            },
          );

          localStorage.removeItem("justLoggedIn");
        }
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [showSplash]);
  // const handleToggle = (e) => {

  // if (e.target.checked)
  // {//     navigate("/anime");//   }// };

  if (showSplash) {
    return <SplashScreen onEnd={() => setShowSplash(false)} />;
  }

  if (!trendingContent) {
    return (
      <div className="min-h-screen text-white relative">
        <Navbar />

        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
      </div>
    );
  }
  return (
    <>
      <div className="relative min-h-screen text-white">
        <Navbar />

        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}

        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          onLoad={() => setImgLoading(false)}
          alt="hero img"
          className="absolute top-0 left-0 w-full h-full object-cover -z-50"
        />

        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50"
          aria-hidden="true"
        />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
          <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute top-0 left-0 w-full h-full -z-10" />

          <div className="max-w-2xl">
            <h1 className="mt-4 md:text-6xl text-4xl font-extrabold text-balance">
              {trendingContent?.title || trendingContent?.name}
            </h1>

            <p className="mt-2 text-lg">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date?.split("-")[0]}{" "}
              | {trendingContent?.adult ? "Adult Content" : "PG-13"}
            </p>

            <p className="mt-4 sm:text-lg">
              {trendingContent?.overview.length > 200
                ? trendingContent.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>

          <div className="flex mt-8">
            <Link
              to={`/watch/${contentType}/${trendingContent?.id}`}
              className="bg-white hover:bg-white/80 text-black font-bold px-4 py-2 rounded mr-4 flex items-center"
            >
              <Play className="size-6 inline-block mr-2 fill-black" />
              Play
            </Link>

            <Link
              to={`/watch/${contentType}/${trendingContent?.id}`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded mr-4 flex items-center"
            >
              <Info className="size-6 inline-block mr-2" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10">
        <h2 className="text-2xl md:text-4xl mx-auto text-white px-5 font-bold md:px-20">
          {contentType.toUpperCase()}
          {contentType === "tv" ? " Shows" : "S"}
        </h2>

        {/* CONTINUE WATCHING */}
        {watchHistoryData.length > 0 && (
          <div className="px-5 md:px-20 group">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Continue Watching
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Pick up where you left off
                </p>
              </div>

              <button className="text-sm text-gray-300 hover:text-white transition">
                View All →
              </button>
            </div>

            {/* SCROLL CONTAINER */}
            <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              {watchHistoryData.map((item) => {
                const localData = watchHistory?.[item.id];
                return (
                  <Link
                    key={item.id}
                    to={`/watch/${item.type}/${item.id}`}
                    className="group/card relative min-w-[200px] md:min-w-[270px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 snap-start"
                  >
                    {/* IMAGE */}
                    <div className="relative">
                      <img
                        src={ORIGINAL_IMG_BASE_URL + item?.image}
                        alt={item.title || item.name}
                        className="w-full h-[240px] md:h-[280px] object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      {/* PLAY BUTTON */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                          <Play className="fill-white text-white ml-1 size-7" />
                        </div>
                      </div>

                      {/* TYPE BADGE */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/70  text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide border border-white/10">
                          {item.type}
                        </span>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-700">
                        <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg line-clamp-1 group-hover/card:text-blue-400 transition">
                        {item.title || item.name}
                      </h3>

                      {/* TV INFO */}
                      {item.type === "tv" && localData && (
                        <p className="text-sm text-gray-400 mt-2">
                          Season {localData.season || 1} • Episode{" "}
                          {localData.episode || 1}
                        </p>
                      )}

                      {/* CONTINUE BUTTON */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-300 group-hover/card:text-white transition">
                        <Play className="size-4 fill-current" />
                        Continue Watching
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* CATEGORY SLIDERS */}
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
        {/* <div className="flex flex-col items-center justify-center font-semibold">
      <h2 className="mb-2 text-white text-lg lg:text-2xl">
        Switch to Anime World
      </h2>
      <label className="switch">
        <input
          type="checkbox"
          onChange={handleToggle}
        />
        <span className="slider round"></span>
      </label>
    </div> */}
      </div>
    </>
  );
};

export default HomeScreen;
