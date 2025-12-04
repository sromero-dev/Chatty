import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error getting users: ", error);
      toast.error("Error getting users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isMessagesLoading: true });
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error getting messages: ", error);
      toast.error("Error getting messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    try {
      const res = await axiosInstance.post("/messages", data);
      res.status(200).json(res.data);
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Error sending message");
    }
  },

  setSelectedUser: (user) => {
    console.log(user);
    set({ selectedUser: user });
  },
}));
