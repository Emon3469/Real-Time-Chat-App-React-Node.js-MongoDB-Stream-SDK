import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/notifications", icon: BellIcon, label: "Notifications" },
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="size-36" />
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${pathname === to
                ? "bg-primary text-primary-content"
                : "text-base-content hover:bg-base-300"
              }`}
          >
            <Icon className="size-5 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Current user footer */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="avatar size-10 rounded-full overflow-hidden bg-base-300">
              <img src={authUser?.profilePic} alt="Avatar" className="object-cover" />
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-base-200" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{authUser?.fullName}</p>
            {authUser?.username ? (
              <p className="text-xs text-base-content/50 truncate">@{authUser.username}</p>
            ) : (
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-success inline-block" />
                Online
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
