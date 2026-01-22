import { useEffect } from "react";
import { useChatStore } from "../hooks/useChatStore";
import { useAuthStore } from "../hooks/useAuthStore";
import { useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnline, setShowOnline] = useState(false);

  const filteredUsers = showOnline
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 overflow-hidden">
      {/* Encabezado fijo */}
      <div className="border-b border-base-300 w-full p-4.5 shrink-0">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Checkbox para mostrar usuarios online */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnline}
              onChange={(e) => setShowOnline(e.target.checked)}
              className="checkbox checkbox-sm rounded-full"
            />
            <span className="text-sm text-zinc-500">Show online users</span>
          </label>
          <span className="text-xs text-zinc-400">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* Lista de usuarios con scroll interno */}
      <div className="flex-1 overflow-y-auto w-full p-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 cursor-pointer hover:bg-base-300 transition-colors rounded-lg ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/default.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 bg-green-500" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-xs text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showOnline ? "No online users" : "No users available"}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
