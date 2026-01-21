import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../hooks/useAuthStore";
import { useChatStore } from "../hooks/useChatStore";
import { formatMessageTime } from "../lib/utils";

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

  // 👇 Para debug: muestra la estructura de los mensajes y authUser
  useEffect(() => {
    console.log("=== DIAGNÓSTICO DE DATOS ===");
    console.log("authUser:", authUser);
    console.log("authUser._id:", authUser?._id);
    console.log("authUser._id tipo:", typeof authUser?._id);
    console.log("selectedUser:", selectedUser);

    if (messages.length > 0) {
      console.log("Primer mensaje completo:", messages[0]);
      console.log("senderId del primer mensaje:", messages[0].senderId);
      console.log("Tipo de senderId:", typeof messages[0].senderId);

      if (typeof messages[0].senderId === "object") {
        console.log("senderId._id:", messages[0].senderId._id);
        console.log("senderId._id tipo:", typeof messages[0].senderId._id);
        console.log("senderId.fullName:", messages[0].senderId.fullName);
      }

      // Verificar todos los mensajes
      messages.forEach((msg, index) => {
        const senderId =
          typeof msg.senderId === "object"
            ? msg.senderId._id?.toString()
            : msg.senderId?.toString();
        const isOwn = senderId === authUser?._id;
        console.log(`Mensaje ${index}:`, {
          text: msg.text?.substring(0, 30),
          senderId,
          authUserId: authUser?._id,
          isOwn,
          senderName:
            typeof msg.senderId === "object" ? msg.senderId.fullName : "N/A",
        });
      });
    }
    console.log("=== FIN DIAGNÓSTICO ===");
  }, [messages, authUser, selectedUser]);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading || !selectedUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageInput />
      </div>
    );
  }

  // Función auxiliar para obtener el ID del remitente
  const getSenderId = (message) => {
    if (!message.senderId) return null;

    // Manejar todos los casos posibles
    if (typeof message.senderId === "object") {
      // Caso 1: senderId es un objeto con _id
      if (message.senderId._id) {
        return message.senderId._id.toString();
      }
      // Caso 2: senderId es un objeto sin _id (poco probable)
      return null;
    }
    // Caso 3: senderId es un string
    return message.senderId.toString();
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const senderId = getSenderId(message);
            const isOwnMessage = senderId === authUser._id;

            // Para debug en tiempo real
            console.log(`Renderizando mensaje:`, {
              text: message.text?.substring(0, 20),
              senderId,
              authUserId: authUser._id,
              isOwnMessage,
              lado: isOwnMessage
                ? "DERECHA (chat-end)"
                : "IZQUIERDA (chat-start)",
            });

            // Obtener la foto de perfil del remitente
            let senderProfilePic;
            if (isOwnMessage) {
              senderProfilePic = authUser.profilePic || "/default.png";
            } else {
              // Si el senderId es un objeto poblado, usa su profilePic
              if (
                typeof message.senderId === "object" &&
                message.senderId.profilePic
              ) {
                senderProfilePic = message.senderId.profilePic;
              } else {
                // Si no, usa la del selectedUser
                senderProfilePic = selectedUser.profilePic || "/default.png";
              }
            }

            return (
              <div
                key={message._id || message.text}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img src={senderProfilePic} alt="profile pic" />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  {typeof message.senderId === "object" &&
                    message.senderId.fullName && (
                      <span className="font-medium mr-2">
                        {message.senderId.fullName}
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
