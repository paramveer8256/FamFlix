import React, { useEffect, useState } from "react";
import useWatchStore from "../store/watchStore";

const TvEpisodes = ({ id, onSetData, seasons }) => {
  const { setCurrentWatch, getWatchHistoryById } = useWatchStore();

  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState("");

  //  Load from watchHistory if exists
  useEffect(() => {
    const saved = getWatchHistoryById(id);

    if (saved && saved.type === "tv") {
      const savedSeason = seasons.find((s) => s.season_number === saved.season);
      if (savedSeason) {
        setSelectedSeason(savedSeason);
        setSelectedEpisode(String(saved.episode));
      }
    }
  }, [id, seasons, getWatchHistoryById]);

  //  When user selects new episode
  useEffect(() => {
    if (selectedSeason && selectedEpisode !== "") {
      const sNum = selectedSeason.season_number;
      const eNum = parseInt(selectedEpisode);

      onSetData({
        id,
        showSeason: sNum,
        showEpisode: eNum,
      });

      // Save in current + history
      setCurrentWatch({
        contentId: id,
        type: "tv",
        season: sNum,
        episode: eNum,
      });
    }
  }, [selectedSeason, selectedEpisode, id, onSetData, setCurrentWatch]);

  return (
    <div className="flex flex-col max-w-6xl items-center gap-4 mt-4">
      {/* Season Buttons */}
      <div className="flex flex-wrap gap-3 justify-center overflow-y-auto max-w-276 max-h-[100px] min-h-[48px]">
        {seasons
          ?.filter((s) => s.episode_count > 0)
          .map((season) => (
            <button
              key={season?.id}
              onClick={() => {
                setSelectedSeason(season);
                setSelectedEpisode("");
              }}
              className={`${
                selectedSeason?.id === season.id ? "bg-blue-600" : "bg-gray-600"
              } text-white rounded w-30 px-3 py-2 transition`}
            >
              {season?.name}
            </button>
          ))}
      </div>

      {/* Episode Buttons */}
      {selectedSeason && (
        <div className="flex flex-wrap rounded overflow-y-auto max-w-276 max-h-[200px] px-1 py-2 border-blue-500/90 gap-2 justify-center min-h-[48px]">
          {[...Array(selectedSeason.episode_count)].map((_, index) => {
            const epNumber = (index + 1).toString();
            return (
              <button
                key={epNumber}
                onClick={() => setSelectedEpisode(epNumber)}
                className={`${
                  selectedEpisode === epNumber ? "bg-blue-500" : "bg-gray-700"
                } text-white w-15 rounded px-3 py-1 transition`}
              >
                {epNumber}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TvEpisodes;
