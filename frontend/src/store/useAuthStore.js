import { create } from "zustand";
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
}));
