import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, getUserFriends } from "../lib/api";
import toast from "react-hot-toast";
import { LoaderIcon, UsersIcon, XIcon } from "lucide-react";

const CreateGroupModal = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createGroup,
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success(`"${newGroup.name}" created!`);
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Could not create group.");
    },
  });

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Enter a group name.");
    if (selectedIds.size === 0) return toast.error("Select at least one friend.");
    mutate({ name: name.trim(), description: description.trim(), memberIds: [...selectedIds] });
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h2 className="text-lg font-bold">Create a Group</h2>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={onClose}>
            <XIcon className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Group name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Group Name *</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="e.g. Weekend Crew"
                maxLength={50}
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
                <span className="label-text-alt text-base-content/50">optional</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full"
                placeholder="What's this group about?"
                maxLength={120}
              />
            </div>

            {/* Friend picker */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1.5">
                  <UsersIcon className="size-4" />
                  Add Friends
                </span>
                <span className="label-text-alt text-base-content/50">
                  {selectedIds.size} selected
                </span>
              </label>

              {loadingFriends ? (
                <div className="flex justify-center py-6">
                  <span className="loading loading-spinner loading-md" />
                </div>
              ) : friends.length === 0 ? (
                <p className="text-sm text-base-content/50 py-4 text-center">
                  You have no friends to add yet.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {friends.map((f) => (
                    <label
                      key={f._id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors
                        ${selectedIds.has(f._id) ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-base-200"}`}
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={selectedIds.has(f._id)}
                        onChange={() => toggle(f._id)}
                      />
                      <div className="avatar size-9 rounded-full overflow-hidden bg-base-300 shrink-0">
                        <img src={f.profilePic} alt={f.fullName} className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{f.fullName}</p>
                        {f.username && (
                          <p className="text-xs text-base-content/50">@{f.username}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-base-300 flex gap-3">
            <button type="button" className="btn btn-ghost flex-1" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isPending || !name.trim() || selectedIds.size === 0}
            >
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin size-4" />
                  Creating…
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
