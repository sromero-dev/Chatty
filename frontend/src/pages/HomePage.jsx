import { useChatStore } from "../hooks/useChatStore";
import { useAuthStore } from "../hooks/useAuthStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { selectedUser } = useChatStore();
  const { authUser, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay usuario autenticado y ya terminó de verificar, redirigir al login
    if (!isCheckingAuth && !authUser) {
      navigate("/login");
    }
  }, [authUser, isCheckingAuth, navigate]);

  // Mostrar loading mientras verifica autenticación
  if (isCheckingAuth) {
    return (
      <div className="h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Auth checking...</p>
        </div>
      </div>
    );
  }

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
