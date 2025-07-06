import React, { useEffect, useState } from "react";

const TvEpisodes = ({ id, onSetData, seasons }) => {
  const [selectedSeason, setSelectedSeason] =
    useState(null);
  const [selectedEpisode, setSelectedEpisode] =
    useState("");

  useEffect(() => {
    if (selectedSeason && selectedEpisode !== "") {
      onSetData({
        id,
        showSeason: selectedSeason.season_number,
        showEpisode: selectedEpisode,
      });
    }
  }, [selectedSeason, selectedEpisode, id, onSetData]);

  return (
    <div className="flex flex-col max-w-6xl items-center gap-4 mt-4">
      {/* Season Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {seasons
          .filter((s) => s.episode_count > 0) // Optional: skip empty seasons
          .map((season) => (
            <button
              key={season.id}
              onClick={() => {
                setSelectedSeason(season);
                setSelectedEpisode(""); // reset episode on season change
              }}
              className={`${
                selectedSeason?.id === season.id
                  ? "bg-blue-600"
                  : "bg-gray-600"
              } text-white rounded px-3 py-2 transition`}
            >
              {season.name}
            </button>
          ))}
      </div>

      {/* Episode mobile Buttons */}
      {selectedSeason && (
        <div className="flex md:hidden border-3 rounded max-w-88 max-h-[200px] py-2 overflow-y-auto border-blue-500/90 flex-wrap gap-2  justify-center">
          {[...Array(selectedSeason.episode_count)].map(
            (_, index) => {
              const epNumber = (index + 1).toString();
              return (
                <button
                  key={epNumber}
                  onClick={() =>
                    setSelectedEpisode(epNumber)
                  }
                  className={`${
                    selectedEpisode === epNumber
                      ? "bg-blue-500"
                      : "bg-gray-700"
                  } text-white w-15 h-9 rounded px-3 py-1 transition`}
                >
                  {epNumber}
                </button>
              );
            }
          )}
        </div>
      )}
      {/* Episode Buttons */}
      {selectedSeason && (
        <div className="hidden md:flex flex-wrap border-3 rounded overflow-y-auto max-w-276 max-h-[200px] px-1 py-2 border-blue-500/90 gap-2  justify-center min-h-[48px]">
          {[...Array(selectedSeason.episode_count)].map(
            (_, index) => {
              const epNumber = (index + 1).toString();
              return (
                <button
                  key={epNumber}
                  onClick={() =>
                    setSelectedEpisode(epNumber)
                  }
                  className={`${
                    selectedEpisode === epNumber
                      ? "bg-blue-500"
                      : "bg-gray-700"
                  } text-white w-15 rounded px-3 py-1 transition`}
                >
                  {epNumber}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default TvEpisodes;
