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

    // Añade validación
    if (!authUser || !authUser._id) {
      console.error("authUser no tiene estructura correcta:", authUser);
      toast.error("Error: usuario no autenticado correctamente");
      return;
    }

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
    if (!socket) return;

    const messageHandler = (newMessage) => {
      console.log("Nuevo mensaje recibido en tiempo real:", newMessage);

      // Verificar si el mensaje es para esta conversación
      const currentSelectedUser = get().selectedUser;
      if (!currentSelectedUser) return;

      const authUser = useAuthStore.getState().authUser;
      if (!authUser) return;

      // Obtener IDs para comparación (convertir a strings)
      const getMessageSenderId = (msg) => {
        if (!msg.senderId) return null;
        if (typeof msg.senderId === "string") return msg.senderId;
        if (msg.senderId._id) return msg.senderId._id.toString();
        return null;
      };

      const senderId = getMessageSenderId(newMessage);
      const receiverId =
        typeof newMessage.recieverId === "object"
          ? newMessage.recieverId._id?.toString()
          : newMessage.recieverId?.toString();

      // Verificar si el mensaje es para esta conversación
      const isMessageForThisChat =
        (senderId === currentSelectedUser._id.toString() &&
          receiverId === authUser._id.toString()) ||
        (senderId === authUser._id.toString() &&
          receiverId === currentSelectedUser._id.toString());

      if (isMessageForThisChat) {
        console.log(
          "Mensaje agregado al chat actual:",
          newMessage.text?.substring(0, 30),
        );
        set({ messages: [...get().messages, newMessage] });
      } else {
        console.log("Mensaje ignorado - no es para este chat");
      }
    };

    socket.on("newMessage", messageHandler);

    // Devolver función de cleanup
    return () => {
      socket.off("newMessage", messageHandler);
    };
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    // Permitir establecer null para cerrar el chat
    if (user === null) {
      set({ selectedUser: null, messages: [] });
      return;
    }

    const currentSelectedUser = get().selectedUser;

    // Si es el mismo usuario, no hacer nada
    if (currentSelectedUser && currentSelectedUser._id === user._id) {
      return;
    }

    console.log("User selected: ", user);
    set({ selectedUser: user, messages: [] });
  },
}));
