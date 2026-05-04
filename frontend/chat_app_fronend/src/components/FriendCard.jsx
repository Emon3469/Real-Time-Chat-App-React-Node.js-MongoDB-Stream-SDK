import { Link } from "react-router";
import { MessageSquareIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="avatar size-12 rounded-full overflow-hidden bg-base-300">
              <img src={friend.profilePic} alt={friend.fullName} className="object-cover" />
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-200" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
            {friend.username && (
              <p className="text-xs text-base-content/50">@{friend.username}</p>
            )}
          </div>
        </div>

        {friend.bio && (
          <p className="text-xs text-base-content/60 line-clamp-2">{friend.bio}</p>
        )}

        <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm w-full gap-2">
          <MessageSquareIcon className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
