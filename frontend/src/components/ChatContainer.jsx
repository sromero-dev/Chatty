import { useChatStore } from "../hooks/useChatStore";
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

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
      <p>messages...</p>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
