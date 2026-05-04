import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteGroup, getMyGroups, leaveGroup } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { LogOutIcon, PlusIcon, Trash2Icon, UsersIcon } from "lucide-react";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";

const GroupsPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: getMyGroups,
  });

  const { mutate: leaveGroupMutation, isPending: leavePending } = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Left group");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Could not leave group"),
  });

  const { mutate: deleteGroupMutation, isPending: deletePending } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Could not delete group"),
  });

  const isAdmin = (group) =>
    group.admin?._id === authUser?._id || group.admin === authUser?._id;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="size-6 text-primary" />
            <h1 className="text-2xl font-bold">Groups</h1>
            {groups.length > 0 && (
              <span className="badge badge-primary">{groups.length}</span>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="size-4" />
            New Group
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
              <UsersIcon className="size-10 text-base-content/30" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No groups yet</h2>
            <p className="text-base-content/60 mb-6 max-w-xs">
              Create a group with your friends to start chatting and calling together.
            </p>
            <button
              className="btn btn-primary gap-2"
              onClick={() => setShowModal(true)}
            >
              <PlusIcon className="size-4" />
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div key={group._id} className="relative">
                <GroupCard group={group} currentUserId={authUser?._id} />

                {/* Leave / Delete actions */}
                <div className="absolute top-3 right-3 flex gap-1">
                  {isAdmin(group) ? (
                    <button
                      className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                      title="Delete group"
                      disabled={deletePending}
                      onClick={() => {
                        if (confirm(`Delete "${group.name}"? This cannot be undone.`)) {
                          deleteGroupMutation(group._id);
                        }
                      }}
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-ghost btn-xs text-warning opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                      title="Leave group"
                      disabled={leavePending}
                      onClick={() => {
                        if (confirm(`Leave "${group.name}"?`)) {
                          leaveGroupMutation(group._id);
                        }
                      }}
                    >
                      <LogOutIcon className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default GroupsPage;
