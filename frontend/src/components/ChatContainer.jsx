import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../hooks/useAuthStore";
import { useChatStore } from "../hooks/useChatStore";
import { formatMessageTime } from "../lib/utils";
import NoChatSelected from "./NoChatSelected";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [error, setError] = useState(null);

  // Estado derivado - eliminar isAuthReady
  const isAuthReady = authUser !== undefined;

  useEffect(() => {
    if (!selectedUser?._id || !isAuthReady) return;

    let isMounted = true;

    const loadMessages = async () => {
      try {
        await getMessages(selectedUser._id);
      } catch (err) {
        console.error("Error cargando mensajes:", err);
        if (isMounted) {
          setError("Error al cargar los mensajes");
        }
      }
    };

    loadMessages();

    const cleanupSubscription = subscribeToMessages();

    return () => {
      isMounted = false;
      if (cleanupSubscription) {
        cleanupSubscription();
      }
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    isAuthReady, // Ahora es un valor derivado
    authUser?._id,
    subscribeToMessages,
    unsubscribeFromMessages,
    getMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Si authUser no está listo, mostrar loading
  if (!isAuthReady) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  // Si no hay usuario seleccionado, mostrar NoChatSelected
  if (!selectedUser) {
    return <NoChatSelected />;
  }

  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 btn btn-sm btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar skeleton
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-2.5 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="skeleton size-10 rounded-full"></div>
            <div className="flex-1">
              <div className="skeleton h-4 w-24 mb-2"></div>
              <div className="skeleton h-3 w-16"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`chat ${i % 2 === 0 ? "chat-start" : "chat-end"}`}
            >
              <div className="chat-image avatar">
                <div className="skeleton size-10 rounded-full"></div>
              </div>
              <div className="chat-bubble">
                <div className="skeleton h-6 w-48"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <div className="skeleton h-12 w-full"></div>
        </div>
      </div>
    );
  }

  // Función para obtener el ID del remitente - VERSIÓN MEJORADA
  const getSenderId = (message) => {
    if (!message.senderId) return null;

    // Si senderId es un objeto, tomar el _id
    if (typeof message.senderId === "object" && message.senderId._id) {
      return message.senderId._id;
    }

    // Si ya es un string, devolverlo directamente
    return message.senderId;
  };

  // Función para verificar si el mensaje es propio - VERSIÓN ROBUSTA
  const isOwnMessage = (message) => {
    // Si no hay authUser, no puede ser mensaje propio
    if (!authUser || !authUser._id) {
      console.warn("authUser no disponible para comparar");
      return false;
    }

    const senderId = getSenderId(message);

    if (!senderId) {
      console.warn("No se pudo obtener senderId del mensaje");
      return false;
    }

    // Comparar como strings
    const senderIdStr = String(senderId);
    const authUserIdStr = String(authUser._id);

    const isOwn = senderIdStr === authUserIdStr;

    return isOwn;
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const ownMessage = isOwnMessage(message);

            // Obtener la foto de perfil
            let senderProfilePic;
            if (ownMessage) {
              senderProfilePic = authUser?.profilePic || "/default.png";
            } else {
              if (
                typeof message.senderId === "object" &&
                message.senderId.profilePic
              ) {
                senderProfilePic = message.senderId.profilePic;
              } else {
                senderProfilePic = selectedUser.profilePic || "/default.png";
              }
            }

            return (
              <div
                key={message._id || `${message.createdAt}-${message.text}`}
                className={`chat ${ownMessage ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={senderProfilePic}
                      alt="profile pic"
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/default.png";
                      }}
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  {!ownMessage && typeof message.senderId === "object" && (
                    <span className="font-medium mr-2">
                      {message.senderId.fullName || selectedUser.fullName}
                    </span>
                  )}
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet.</p>
            <p className="text-sm">Send a message to start a conversation!</p>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
