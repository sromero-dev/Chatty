import { useChatStore } from "../hooks/useChatStore";
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../hooks/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  if (isMessagesLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 flex-col overflow-auto space-y-auto">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 flex overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === selectedUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.image || "/default.png"
                      : selectedUser.image || "/default.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] sm:max-h-[200px] max-w-[100px] max-h-[100px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
