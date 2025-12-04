import { LucideClockFading } from "lucide-react";
import { useChatStore } from "../store/ChatStore";
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  if (isMessagesLoading) return <LucideClockFading />;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {/* Messages */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
