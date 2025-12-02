import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      if (!res.data) set({ authUser: false }); // Checks if user is authenticated, does not allow Null values
      set({ authUser: res.data });
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

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
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
}));
