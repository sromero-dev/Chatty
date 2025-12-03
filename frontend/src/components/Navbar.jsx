import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  ArrowBigRightDash,
  CircleUserRound,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

function Navbar() {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left -> Link to HOME */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-75 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          {/* Right -> Auth Buttons */}
          <div className="flex items-center gap-2.5">
            {authUser && (
              <>
                <Link to="/profile" className="btn btn-accent btn-sm gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center btn btn-error btn-sm"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            {!authUser && (
              <>
                <Link to="/signup" className="btn btn-accent btn-sm gap-2">
                  <ArrowBigRightDash className="size-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
                <i className="text-sm opacity-50"> or </i>
                <Link to="/login" className="btn btn-accent btn-sm gap-2">
                  <CircleUserRound className="size-4" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
              </>
            )}

            <Link
              to="/settings"
              className="btn btn-info btn-sm gap-2 bg-primary border-0"
            >
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
