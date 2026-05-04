import { useRef, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShuffleIcon,
  UserIcon,
  AtSignIcon,
  CheckIcon,
} from "lucide-react";

const MAX_PX = 400;

function resizeToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_PX || height > MAX_PX) {
          if (width > height) {
            height = Math.round((height * MAX_PX) / width);
            width = MAX_PX;
          } else {
            width = Math.round((width * MAX_PX) / height);
            height = MAX_PX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile saved!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    setFormState((prev) => ({
      ...prev,
      profilePic: `https://avatar.iran.liara.run/public/${idx}.png`,
    }));
    toast.success("Random avatar generated!");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Image must be under 6 MB.");
      return;
    }
    try {
      const base64 = await resizeToBase64(file);
      setFormState((prev) => ({ ...prev, profilePic: base64 }));
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Could not read the image. Try another file.");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-2xl shadow-xl">
        <div className="card-body p-6 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Set Up Your Profile</h1>
            <p className="text-base-content/60 mt-1">Tell others a bit about yourself</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative size-28 rounded-full bg-base-300 overflow-hidden cursor-pointer group ring-2 ring-base-300 hover:ring-primary transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-10 text-base-content/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <CameraIcon className="size-7 text-white" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-sm btn-outline"
                >
                  <CameraIcon className="size-4" />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-sm btn-outline"
                >
                  <ShuffleIcon className="size-4" />
                  Random Avatar
                </button>
              </div>
            </div>

            {/* Full name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name *</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-base-content/50" />
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState((p) => ({ ...p, fullName: e.target.value }))}
                  className="input input-bordered w-full pl-10"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
                <span className="label-text-alt text-base-content/50">optional</span>
              </label>
              <div className="relative">
                <AtSignIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-base-content/50" />
                <input
                  type="text"
                  value={formState.username}
                  onChange={(e) =>
                    setFormState((p) => ({
                      ...p,
                      username: e.target.value.toLowerCase().replace(/\s+/g, ""),
                    }))
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="yourhandle"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">About Me</span>
                <span className="label-text-alt text-base-content/50">optional</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState((p) => ({ ...p, bio: e.target.value }))}
                className="textarea textarea-bordered h-24 resize-none"
                placeholder="Tell others a bit about yourself…"
              />
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Location</span>
                <span className="label-text-alt text-base-content/50">optional</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-base-content/50" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState((p) => ({ ...p, location: e.target.value }))}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin size-5" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckIcon className="size-5" />
                  Complete Setup
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
