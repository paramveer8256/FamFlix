import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWatchStore = create(
  persist(
    (set, get) => ({
      currentWatch: null,
      watchHistory: {},

      // Update current watch & history
      setCurrentWatch: (data) => {
        // Save the current show
        set({ currentWatch: data });

        // Merge with history
        const history = get().watchHistory || {};

        const updatedHistory = {
          ...history,
          [data.contentId]: {
            contentId: data.contentId,
            type: data.type,
            season: data.season,
            episode: data.episode,
            updatedAt: new Date().toISOString(),
          },
        };

        set({ watchHistory: updatedHistory });
      },

      // Get a show’s saved season/episode from history
      getWatchHistoryById: (id) => {
        const history = get().watchHistory || {};
        return history[id] || null;
      },

      clearCurrent: () => set({ currentWatch: null }),
      clearAllHistory: () => set({ watchHistory: {} }),
    }),
    {
      name: "watch-progress", // stored in localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useWatchStore;
