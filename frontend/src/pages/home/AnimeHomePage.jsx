import AnimeNav from "../../components/AnimeNav.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Play, Info } from "lucide-react";
const AnimeHomePage = () => {
  const navigate = useNavigate();
  const [trendingContent, setTrendingContent] =
    useState(null);
  const [images, setImages] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);
  const handleToggle = (e) => {
    if (!e.target.checked) {
      navigate("/");
    }
  };
  useEffect(() => {
    const getTrendingContent = async () => {
      try {
        const res = await axios.get(
          `/api/v1/anime/trending`
        );
        setTrendingContent(res.data.content);
        setImages(res.data.images);
      } catch (err) {
        console.error(
          "Error fetching trending content:",
          err
        );
      }
    };
    getTrendingContent();
  }, []);

  if (!trendingContent) {
    return (
      <div className="h-screen text-white relative">
        <AnimeNav />
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 
          shimmer"
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative text-white min-h-screen">
        <AnimeNav />

        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}

        <img
          src={
            trendingContent?.images?.jpg?.large_image_url
          }
          alt="hero img"
          onLoad={() => setImgLoading(false)}
          className="absolute top-0 left-0 object-cover  w-full h-full -z-50"
        />
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col justify-center
              px-8 md:px-16 lg:px-32"
        >
          <div
            className="bg-gradient-to-b from-black via-transparent to-transparent absolute top-0 left-0 w-full h-full -z-10"
            aria-hidden="true"
          />
          <div className="max-w-2xl ">
            <h1 className="mt-4 md:text-6xl text-4xl font-extrabold text-balance">
              {trendingContent?.title_english ||
                trendingContent?.title}
            </h1>
            <p className="mt-2 text-lg">
              Aired | {trendingContent?.aired?.string}
            </p>
            <p className="mt-4 sm:text-lg">
              {trendingContent?.synopsis?.slice(0, 200)}
              <Link
                className="font-bold"
                to={`/anime/watch/${trendingContent?.mal_id}`}
              >
                {" "}
                . . . more
              </Link>
            </p>
          </div>
          <div className="flex mt-8">
            <Link
              to={`/anime/watch/${trendingContent?.mal_id}`}
              className="bg-white hover:bg-white/80 text-black font-bold px-4 py-2 rounded  mr-4 flex items-center"
            >
              <Play className="size-6 inline-block mr-2 fill-black" />
              Play
            </Link>
            <Link
              to={`/anime/watch/${trendingContent?.mal_id}`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded  mr-4 flex items-center"
            >
              <Info className="size-6 inline-block mr-2" />
              More Info
            </Link>
          </div>
        </div>
      </div>
      <div className="relative bg-black z-10 flex flex-col items-center justify-center font-semibold">
        <h2 className="mb-2 text-white text-lg lg:text-2xl font-serif">
          Switch to Movie World
        </h2>
        <label className="switch">
          <input
            type="checkbox"
            defaultChecked
            onChange={handleToggle}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </>
  );
};

export default AnimeHomePage;
