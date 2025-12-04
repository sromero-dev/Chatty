import { useEffect } from "react";
import { useChatStore } from "../hooks/useChatStore";

function Sidebar() {
  const { getUsers, users, selectedUsers, setSelectedUser, isUsersLoading } =
    useChatStore();

  const onlineUsers = [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return <div>Sidebar</div>;
}

export default Sidebar;
