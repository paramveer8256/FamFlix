import AnimeNav from "../../components/AnimeNav.jsx";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Play, StickyNote } from "lucide-react";
import { Link } from "react-router-dom";
import WatchPageSkeleton from "../../components/skeletons/WatchPageSkeleton.jsx";

const AnimeWatchPage = () => {
  const { id } = useParams();
  const [content, setContent] = React.useState([]);
  const [anime, setAnime] = React.useState([]);
  const [similar, setSimilar] = React.useState([]);
  const [showEpisodes, setShowEpisodes] =
    React.useState(false);
  const [page, setPage] = React.useState(1);
  const [episodeNumber, setEpisodeNumber] =
    React.useState(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  // Toggle episode section
  function handleShow() {
    setShowEpisodes((prev) => !prev);
    setPage(1);
    fetchEpisodes(1);
  }

  // Fetch episodes
  async function fetchEpisodes(page) {
    try {
      const res = await axios.get(
        `/api/v1/anime/episodes?id=${id}&page=${page}`
      );
      setContent(res.data.content);
      setTotalPages(res.data.totalPages || 1);
      // Auto-select first episode if available
      if (res.data.content && res.data.content.length > 0) {
        setEpisodeNumber(res.data.content[0].mal_id);
      }
    } catch (error) {
      console.error("Failed to fetch episodes", error);
    }
  }
  useEffect(() => {
    setShowEpisodes(false);
  }, [id]);

  useEffect(() => {
    async function fetchAnime() {
      setLoading(() => true);
      try {
        const res = await axios.get(
          `/api/v1/anime/full?id=${id}`
        );
        setAnime(res.data.content);
      } catch (error) {
        console.error("Failed to fetch episodes", error);
      } finally {
        setLoading(() => false);
      }
    }
    fetchAnime();
  }, [id]);
  useEffect(() => {
    setLoading(() => true);
    async function fetchAnimeRecommendations() {
      try {
        const res = await axios.get(
          `/api/v1/anime/recommendations?id=${id}`
        );
        setSimilar(res.data.content);
      } catch (error) {
        console.error("Failed to fetch episodes", error);
      } finally {
        setLoading(() => false);
      }
    }
    fetchAnimeRecommendations();
  }, [id]);
  // Set selected episode
  function handleClick(malId) {
    setEpisodeNumber(malId);
  }

  // Set selected page
  function handlePageChange(pageIndex) {
    setPage(pageIndex);
    setContent([]);
    fetchEpisodes(pageIndex);
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto container h-full">
        <AnimeNav />

        {/* Iframe Player */}
        <div className="px-4 py-8 max-w-6xl mx-auto">
          <div className="relative w-full h-full md:h-170 mt-10 mb-4 aspect-video">
            {/* Mobile */}
            <iframe
              src={`https://vidsrc.cc/v2/embed/anime/ani${id}/${episodeNumber}/dub`}
              width="95%"
              height="90%"
              referrerPolicy="origin"
              allowFullScreen
              className="mx-auto border-2 lg:hidden border-red-500 rounded mt-4"
            ></iframe>

            {/* Desktop */}
            <iframe
              src={`https://vidsrc.cc/v2/embed/anime/ani${id}/${episodeNumber}/dub`}
              width="90%"
              height="90%"
              referrerPolicy="origin"
              allowFullScreen
              className="lg:block hidden mx-auto rounded-xl mt-4 border-2 border-red-500"
            ></iframe>
          </div>
        </div>

        {/* Episode Controls */}
        <div className="flex flex-col mt-10 md:mt-0 items-center gap-4">
          {/* Toggle button */}
          <button
            onClick={handleShow}
            className={`${
              showEpisodes ? "bg-red-500/90" : "bg-gray-500"
            } hover:bg-red-700 text-white mx-auto rounded px-4 py-2 transition duration-200`}
          >
            Show Episodes
          </button>

          {/* Page Buttons */}
          {showEpisodes && (
            <div className="flex justify-center max-w-6xl overflow-x-auto scrollbar-hide flex-wrap my-5">
              {[...Array(totalPages)].map((_, index) => (
                <div key={index} className="p-2">
                  <div
                    className={`${
                      page === index + 1
                        ? "bg-red-500 text-white"
                        : "bg-gray-400"
                    } p-2 w-15 justify-center items-center flex rounded cursor-pointer`}
                    onClick={() =>
                      handlePageChange(index + 1)
                    }
                  >
                    <StickyNote className="size-4 mr-2" />
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Episode Buttons */}
          {showEpisodes && (
            <div className="flex justify-center max-w-6xl h-45 md:h-auto overflow-x-auto scrollbar-hide flex-wrap my-5">
              {content?.map((episode) => (
                <div key={episode?.mal_id} className="p-2">
                  <div
                    className={`${
                      episodeNumber === episode?.mal_id
                        ? "bg-red-500 text-white"
                        : "bg-gray-400"
                    } p-2 w-22 justify-center items-center flex rounded cursor-pointer`}
                    onClick={() =>
                      handleClick(episode?.mal_id)
                    }
                  >
                    <Play className="size-4 mr-2" />
                    {episode?.mal_id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="max-w-6xl px-4 mx-auto py-10 ">
          <div className="text-2xl md:text-5xl font-bold">
            {anime?.title_english || anime?.title}
          </div>
          <div className="text-gray-400">
            {anime?.rating}
          </div>
          <div className="text-xl md:text-2xl">
            ⭐ {anime?.score}
          </div>
          <span className="text-red-500 md:text-xl">
            Genres:
            <span className="text-gray-400 text-sm md:text-lg pl-2">
              {anime?.genres?.map((genre) => (
                <>{genre?.name} </>
              ))}
            </span>
          </span>
          <div>
            <span className="text-red-500 md:text-xl">
              {" "}
              Status:
            </span>
            <span className="text-gray-400 text-sm md:text-lg pl-2">
              {anime?.status}
            </span>
          </div>
          <div>
            <span className="text-red-500 md:text-xl">
              {" "}
              Rank:
            </span>
            <span className="text-gray-400 text-sm md:text-lg pl-2">
              {anime?.rank}
            </span>
          </div>
          <div>
            <span className="text-red-500 md:text-xl">
              {" "}
              Year:
            </span>
            <span className="text-gray-400 text-sm md:text-lg pl-2">
              {anime?.year}
            </span>
          </div>
          <div>
            <span className="text-red-500 md:text-xl">
              {" "}
              Season:
            </span>
            <span className="text-gray-400 text-sm md:text-lg pl-2">
              {anime?.season || null}
            </span>
          </div>
          <div className="text-red-500 md:text-xl leading-0">
            Overview:
            <span className="text-gray-400 text-sm md:text-lg pl-2">
              {anime?.synopsis}
            </span>
          </div>
          <div className="text-red-500 md:text-xl">
            Poster:
            <div className="text-gray-400 text-sm md:text-lg pl-2">
              <img
                src={anime?.images?.jpg?.image_url}
                alt="poster img"
                className="w-32 mx-auto h-50 md:w-80 md:h-100 rounded"
              />
            </div>
          </div>
          <div>
            {similar?.length > 0 && (
              <div className="mt-12 max-w-6xl px-4 mx-auto relative">
                <h3 className="text-3xl font-bold mb-4">
                  Similar Animes
                </h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 group">
                  {similar.map((item) => (
                    <Link
                      key={item?.entry?.mal_id}
                      to={`/anime/watch/${item?.entry?.mal_id}`}
                      className="w-30 md:w-52 flex-none"
                    >
                      <img
                        src={
                          item?.entry?.images?.jpg
                            ?.image_url || "/fallback.jpg"
                        }
                        alt="poster img"
                        className="w-full h-auto rounded-md"
                      />
                      <h4 className="mt-2 text-sm md:text-lg font-semibold line-clamp-2">
                        {item?.entry?.title_english ||
                          item?.entry?.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeWatchPage;
