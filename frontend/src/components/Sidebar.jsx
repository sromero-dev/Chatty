import { useEffect } from "react";
import { useChatStore } from "../hooks/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

function Sidebar() {
  const { getUsers, users, selectedUsers, setSelectedUser, isUsersLoading } =
    useChatStore();

  const onlineUsers = [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    setTimeout(() => {
      return <SidebarSkeleton />;
    }, 300);
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 overflow-hidden">
      {/* Encabezado fijo */}
      <div className="border-b border-base-300 w-full p-5 shrink-0">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Lista de usuarios con scroll interno */}
      <div className="flex-1 overflow-y-auto w-full p-3">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 cursor-pointer hover:bg-base-300 transition-colors rounded-lg ${
              selectedUsers?._id === user._id
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
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-xs text-zinc-400">
                {user.isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
