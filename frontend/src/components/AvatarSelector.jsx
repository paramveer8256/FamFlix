// AvatarSelector.jsx
import { useState, useEffect } from "react";
import { useAuthUserStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
const avatarCategories = {
  Classic: [
    "classic-1.png",
    "classic-2.png",
    "classic-3.png",
    "classic-4.png",
    "classic-5.png",
    "classic-6.jpg",
  ],
  Funky: [
    "funky-1.png",
    "funky-2.jpg",
    "funky-3.jpg",
    "funky-4.jpg",
    "funky-5.jpg",
    "funky-6.png",
  ],
  Insane: [
    "insane-1.jpg",
    "insane-2.jpg",
    "insane-3.jpg",
    "insane-4.jpg",
    "insane-5.jpg",
    "insane-6.jpg",
  ],
  Old: ["avatar1.png", "avatar2.png", "avatar3.png"],
};

const AvatarSelector = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { user, updateAvatar } = useAuthUserStore();
  const [selected, setSelected] = useState(
    user.image || "/avatars/classic/classic-1.png"
  );

  const handleSelect = (category, avatar) => {
    setSelected(`/avatars/${category}/${avatar}`);
  };

  const handleSave = () => {
    updateAvatar(selected); // Pass selected image URL
    navigate(`/profile/${user.username}`);
  };

  useEffect(() => {
    // Simulate a 2-second loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  if (loading)
    return (
      <div className="bg-black text-white p-4 min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
          <AvatarSelectorSkeleton />
        </div>
      </div>
    );
  return (
    <div className="bg-black text-white min-h-screen  p-4">
      <div className="max-w-6xl mx-auto p-4">
        <div>
          <ArrowLeftIcon
            onClick={() => navigate(-1)}
            className="size-8"
          />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            Edit Avatar
          </h2>
          <img
            src={selected}
            alt="Selected Avatar"
            className="size-24 rounded-full mx-auto mt-4"
          />
          <p className="mt-2">{user.username}</p>
        </div>

        {Object.entries(avatarCategories).map(
          ([category, avatars]) => (
            <div key={category} className="mb-6">
              <h3 className="text-md font-bold mb-2">
                {category}
              </h3>
              <div className="flex gap-3 overflow-x-auto">
                {avatars.map((avatar) => {
                  const imgPath = `/avatars/${category
                    .toLowerCase()
                    .replace(/ /g, "-")}/${avatar}`;
                  return (
                    <img
                      key={avatar}
                      src={imgPath}
                      alt={avatar}
                      onClick={() =>
                        handleSelect(
                          category
                            .toLowerCase()
                            .replace(/ /g, "-"),
                          avatar
                        )
                      }
                      className={`size-18 rounded-full cursor-pointer border-4 ${
                        selected === imgPath
                          ? "border-orange-500"
                          : "border-transparent"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )
        )}

        <div className="text-center mt-8">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-full cursor-pointer"
            onClick={handleSave}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;

const AvatarSelectorSkeleton = () => {
  return (
    <div className="bg-black text-white min-h-screen animate-pulse">
      {/* Top bar with back arrow */}
      <div className="flex items-center mb-6">
        <div className="size-8 bg-gray-700 rounded-full" />
      </div>

      {/* Avatar preview */}
      <div className="text-center mb-6">
        <div className="size-24 bg-gray-700 rounded-full mx-auto mb-2" />
        <div className="h-4 w-24 bg-gray-600 mx-auto rounded" />
        <div className="h-4 w-16 bg-gray-600 mx-auto mt-2 rounded" />
      </div>

      {/* Categories Skeleton */}
      {["Classic", "Funky", "Insane", "Old"].map(
        (category) => (
          <div key={category} className="mb-6">
            <div className="h-4 w-24 bg-gray-600 mb-3 rounded" />
            <div className="overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="size-18 bg-gray-600 rounded-full"
                    />
                  ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
