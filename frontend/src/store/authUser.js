import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "axios";

export const useAuthUserStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  online: false,
  onlineUsers: [],
  setOnlineUsers: (ids) => set({ onlineUsers: ids }),

  addOnlineUser: (id) =>
    set((state) => ({
      onlineUsers: [...new Set([...state.onlineUsers, id])],
    })),

  removeOnlineUser: (id) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter(
        (uid) => uid !== id
      ),
    })),
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(
        "/api/v1/auth/signup",
        credentials
      );
      set({ user: res.data.user, isSigningUp: false });
      toast.success("Account created successfully");
      // Redirect to home page or any other page
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong"
      );
      set({ user: null, isSigningUp: false });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post(
        "/api/v1/auth/login",
        credentials
      );
      set({ user: res.data.user, isLoggingIn: false });
      toast.success("Logged in successfully");
      // Redirect to home page or any other page
    } catch (error) {
      toast.error(
        error.response.data.message || "Login failed"
      );
      set({ user: null, isLoggingIn: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLoggingOut: false });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ user: null, isLoggingOut: false });
      toast.error(
        error.response.data.message || "Logout failed"
      );
    }
  },
  updateWatchList: (newItem) =>
    set((state) => ({
      user: {
        ...state.user,
        watchList: [
          ...(state.user?.watchList || []),
          newItem,
        ],
      },
    })),
  removeFromWatchList: (itemId) =>
    set((state) => ({
      user: {
        ...state.user,
        watchList:
          state.user?.watchList.filter(
            (item) => item.id !== itemId
          ) || [],
      },
    })),
  updateInfo: async ({ avatar, username, email }) => {
    const promise = axios.post("/api/v1/user/updateInfo", {
      avatar,
      username,
      email,
    });

    toast.promise(promise, {
      loading: "Updating profile...",
      success: "Profile updated successfully",
      error: "Failed to update profile",
    });

    try {
      await promise;
      set((state) => ({
        user: {
          ...state.user,
          image: avatar,
          username,
          email,
        },
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("/api/v1/auth/authCheck");
      set({ user: res.data.user, isCheckingAuth: false });
      set({ online: true });
    } catch {
      set({ user: null, isCheckingAuth: false });
      // toast.error(
      //   error.response.data.message || "Something went wrong"
      // ); we dont add it because we dont want to show error if user is not logged in
    }
  },
}));
