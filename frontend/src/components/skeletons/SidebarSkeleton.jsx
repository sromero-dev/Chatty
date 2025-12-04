import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-20">
      <Users className="w-10 h-10 animate-spin" />
    </aside>
  );
};

export default SidebarSkeleton;
