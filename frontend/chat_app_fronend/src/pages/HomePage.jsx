import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  MessageSquareIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import CardSkeleton from "../components/CardSkeleton";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const ids = new Set();
    if (outgoingFriendReqs?.length) {
      outgoingFriendReqs.forEach((req) => ids.add(req.recipient._id));
      setOutgoingRequestsIds(ids);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">

        {/* Friends section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-6 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Friends</h2>
              {friends.length > 0 && (
                <span className="badge badge-primary">{friends.length}</span>
              )}
            </div>
            <Link to="/notifications" className="btn btn-outline btn-sm gap-2">
              <UserPlusIcon className="size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <CardSkeleton count={4} />
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>

        {/* Discover People section */}
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <UserPlusIcon className="size-6 text-secondary" />
              <h2 className="text-2xl font-bold tracking-tight">Discover People</h2>
            </div>
            <p className="text-base-content/60 text-sm">
              Connect with others and start a conversation
            </p>
          </div>

          {loadingUsers ? (
            <CardSkeleton count={6} />
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center">
              <UsersIcon className="size-12 mx-auto mb-3 text-base-content/30" />
              <h3 className="font-semibold text-lg mb-1">No one to discover yet</h3>
              <p className="text-base-content/60 text-sm">
                Check back later — new people join every day!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedUsers.map((user) => {
                const requested = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="card-body p-5 space-y-3">
                      {/* Avatar + name row */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="avatar size-14 rounded-full overflow-hidden bg-base-300">
                            <img src={user.profilePic} alt={user.fullName} className="object-cover" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{user.fullName}</h3>
                          {user.username && (
                            <p className="text-xs text-base-content/50">@{user.username}</p>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-1 text-xs text-base-content/50 mt-0.5">
                              <MapPinIcon className="size-3 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm text-base-content/70 line-clamp-2">{user.bio}</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          className={`btn btn-sm flex-1 ${requested ? "btn-disabled" : "btn-primary"}`}
                          onClick={() => !requested && sendRequestMutation(user._id)}
                          disabled={requested || isPending}
                        >
                          {requested ? (
                            <>
                              <CheckCircleIcon className="size-4" />
                              Requested
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4" />
                              Add Friend
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
