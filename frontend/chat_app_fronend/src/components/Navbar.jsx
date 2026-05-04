import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        {isChatPage && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-9 w-auto transition-transform duration-200 hover:scale-105"
            />
          </Link>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle btn-sm">
              <BellIcon className="h-5 w-5 text-base-content/70" />
            </button>
          </Link>

          <ThemeSelector />

          {/* Avatar + name */}
          <div className="flex items-center gap-2 px-1">
            <div className="relative">
              <div className="avatar size-8 rounded-full overflow-hidden bg-base-300">
                <img src={authUser?.profilePic} alt="Avatar" className="object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-success ring-1 ring-base-200" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{authUser?.fullName}</p>
              {authUser?.username && (
                <p className="text-xs text-base-content/50">@{authUser.username}</p>
              )}
            </div>
          </div>

          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={logoutMutation}
            title="Log out"
          >
            <LogOutIcon className="h-5 w-5 text-base-content/70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
