import { X } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useAuthStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/default.png"}
                alt={selectedUser?.fullName || "User"}
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-semibold">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers?.include(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
