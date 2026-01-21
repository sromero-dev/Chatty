import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL || "http://localhost:5000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      if (!res.data) set({ authUser: false }); // Checks if user is authenticated, does not allow Null values
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth: ", error);
      set({ authUser: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Error signing up: ", error);

      let errorMessage = "An error occurred during sign up";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "Error setting up the request";
      }

      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Error signing up: ", error);

      let errorMessage = "An error occurred during login";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "Error setting up the request";
      }

      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");

      get().disconnectSocket();
    } catch (error) {
      console.error("Error signing up: ", error);

      let errorMessage = "An error occurred during logout";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "Error setting up the request";
      }

      toast.error(errorMessage);
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile: ", error);

      let errorMessage = "Error updating profile";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    try {
      const { authUser } = get();

      if (!authUser || get().socket?.connected) return;

      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });

      socket.connect();

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    } catch (error) {
      console.error("Error connecting socket: ", error);
    }
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
