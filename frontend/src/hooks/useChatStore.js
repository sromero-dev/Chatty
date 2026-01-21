import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  pagination: null,

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

      set({
        messages: res.data.messages || [],
        pagination: res.data.pagination,
      });
    } catch (error) {
      console.error("Error getting messages: ", error);
      toast.error("Error getting messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser; // Obtener authUser

    //  Crear un mensaje temporal optimista con estructura poblada
    const tempMessage = {
      _id: Date.now().toString(),
      senderId: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      recieverId: selectedUser._id,
      text: data.text,
      image: data.image,
      createdAt: new Date().toISOString(),
    };

    // 👇 Actualizar UI inmediatamente
    set({ messages: [...messages, tempMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data,
      );

      // 👇 Reemplazar el mensaje temporal con el real
      const updatedMessages = messages.filter((m) => m._id !== tempMessage._id);
      set({ messages: [...updatedMessages, res.data] });
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Error sending message");
      // 👇 Revertir el mensaje temporal si hay error
      set({ messages: messages.filter((m) => m._id !== tempMessage._id) });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      // 👇 Comparar correctamente considerando que senderId puede ser objeto o string
      const senderId = newMessage.senderId._id
        ? newMessage.senderId._id
        : newMessage.senderId;

      const isMessageSentBySelectedUser = senderId === selectedUser._id;

      if (!isMessageSentBySelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    const currentSelectedUser = get().selectedUser;

    // Si es el mismo usuario, no hacer nada
    if (currentSelectedUser && currentSelectedUser._id === user._id) {
      return;
    }

    console.log("User selected: ", user);
    set({ selectedUser: user, messages: [] });
  },
}));
