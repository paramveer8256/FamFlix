import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "axios";

export const useAuthUserStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: false,
  isLoggingOut: false,
  isLoggingIn: false,
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
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("/api/v1/auth/authCheck");
      set({ user: res.data.user, isCheckingAuth: false });
    } catch {
      set({ user: null, isCheckingAuth: false });
      // toast.error(
      //   error.response.data.message ||
      //     "Something went wrong"
      // ); we dont add it because we dont want to show error if user is not logged in  
    }
  },
}));
