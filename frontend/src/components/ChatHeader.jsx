import { X } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";
import { useChatStore } from "../hooks/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Left side - Avatar and user info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar - Leftmost */}
          <div className="shrink-0">
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedUser.profilePic || "/default.png"}
                  alt={selectedUser.fullName}
                />
              </div>
            </div>
          </div>

          {/* User info - Right of avatar */}
          <div className="min-w-0">
            <h3 className="font-medium truncate">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.some((userId) => userId === selectedUser._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Right side - Close button */}
        <div className="pr-2 shrink-0">
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-ghost btn-circle"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
