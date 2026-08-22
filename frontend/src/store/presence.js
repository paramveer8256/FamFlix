import { create } from "zustand";

export const usePresenceStore = create((set) => ({
  onlineUsers: {},

  setUserStatus: (userId, online) =>
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: online,
      },
    })),

  setOnlineUsers: (userIds) =>
    set(() => {
      const onlineUsers = {};

      userIds.forEach((userId) => {
        onlineUsers[userId] = true;
      });

      return {
        onlineUsers,
      };
    }),
}));
