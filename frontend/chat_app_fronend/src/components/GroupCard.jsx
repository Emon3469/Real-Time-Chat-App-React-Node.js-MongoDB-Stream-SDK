import { Link } from "react-router";
import { MessageSquareIcon, PhoneCallIcon, ShieldIcon, UsersIcon } from "lucide-react";

const GroupCard = ({ group, currentUserId }) => {
  const isAdmin = group.admin?._id === currentUserId || group.admin === currentUserId;
  const memberCount = group.members?.length || 0;

  // Generate a colourful avatar from the first letter when no image is set
  const initials = group.name?.charAt(0).toUpperCase() || "G";

  return (
    <div className="card bg-base-200 hover:shadow-md transition-all duration-200">
      <div className="card-body p-4 space-y-3">
        {/* Group avatar + name */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {group.groupPic ? (
              <div className="size-14 rounded-2xl overflow-hidden bg-base-300">
                <img
                  src={group.groupPic}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-content text-xl font-bold select-none">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold truncate">{group.name}</h3>
              {isAdmin && (
                <span className="badge badge-warning badge-xs gap-0.5 shrink-0">
                  <ShieldIcon className="size-2.5" />
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-base-content/50 mt-0.5">
              <UsersIcon className="size-3" />
              <span>{memberCount} member{memberCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {group.description && (
          <p className="text-xs text-base-content/60 line-clamp-2">{group.description}</p>
        )}

        {/* Member avatars (up to 5) */}
        {group.members?.length > 0 && (
          <div className="flex -space-x-2">
            {group.members.slice(0, 5).map((m) => (
              <div
                key={m._id}
                className="size-7 rounded-full overflow-hidden ring-2 ring-base-200 bg-base-300 shrink-0"
                title={m.fullName}
              >
                <img src={m.profilePic} alt={m.fullName} className="w-full h-full object-cover" />
              </div>
            ))}
            {group.members.length > 5 && (
              <div className="size-7 rounded-full bg-base-300 ring-2 ring-base-200 flex items-center justify-center text-xs text-base-content/60 shrink-0">
                +{group.members.length - 5}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            to={`/groups/${group._id}/chat`}
            className="btn btn-primary btn-sm flex-1 gap-1.5"
          >
            <MessageSquareIcon className="size-4" />
            Chat
          </Link>
          <Link
            to={`/call/${group.streamChannelId}`}
            className="btn btn-secondary btn-sm flex-1 gap-1.5"
          >
            <PhoneCallIcon className="size-4" />
            Call
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
