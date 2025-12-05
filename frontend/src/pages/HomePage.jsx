import { useChatStore } from "../hooks/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

function HomePage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-[calc(100vh-64px)] bg-base-200 overflow-hidden">
      <div className="max-h-screen mt-4 flex items-center justify-center overflow-hidden">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-128px)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
