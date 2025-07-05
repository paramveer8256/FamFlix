import { useState, useEffect, useRef } from "react";
import { useAuthUserStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";

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
  const { user, updateInfo } = useAuthUserStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] =
    useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [selected, setSelected] = useState(
    user.image || "/avatars/classic/classic-1.png"
  );

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSelect = (category, avatar) => {
    setSelected(`/avatars/${category}/${avatar}`);
  };

  const handleSave = () => {
    updateInfo({ username, email, avatar: selected });
    navigate(`/profile/${user.username}`);
  };

  // Dismiss edit mode on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        usernameRef.current &&
        !usernameRef.current.contains(event.target)
      ) {
        setEditingUsername(false);
      }
      if (
        emailRef.current &&
        !emailRef.current.contains(event.target)
      ) {
        setEditingEmail(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
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
    <div className="bg-black text-white min-h-screen p-4">
      <div className="max-w-6xl mx-auto p-4">
        <div>
          <ArrowLeftIcon
            onClick={() => navigate(-1)}
            className="size-8 cursor-pointer"
          />
        </div>

        {/* Avatar preview and editable fields */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">
            Edit Avatar
          </h2>
          <img
            src={selected}
            alt="Selected Avatar"
            className="size-24 rounded-full mx-auto mt-4"
          />

          {/* Username */}
          <div
            ref={usernameRef}
            className="mt-2 flex justify-center items-center gap-2 min-h-[30px]"
          >
            {editingUsername ? (
              <input
                type="text"
                className="bg-gray-800 border border-gray-600 px-2 py-1 h-6 rounded text-center text-white"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  setEditingUsername(false)
                }
              />
            ) : (
              <p className="h-6 leading-6">{username}</p>
            )}
            <PencilIcon
              size={16}
              className="cursor-pointer"
              onClick={() =>
                setEditingUsername((prev) => !prev)
              }
            />
          </div>

          {/* Email */}
          <div
            ref={emailRef}
            className="mt-1 mb-4 max-w-xs mx-auto flex justify-center items-center gap-2 min-h-[30px]"
          >
            {editingEmail ? (
              <input
                type="email"
                className="bg-gray-800 border border-gray-600 px-2 py-1 h-6 w-full rounded text-center text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  setEditingEmail(false)
                }
              />
            ) : (
              <p className="h-6 leading-6">{email}</p>
            )}
            <PencilIcon
              size={16}
              className="cursor-pointer"
              onClick={() =>
                setEditingEmail((prev) => !prev)
              }
            />
          </div>
        </div>

        {/* Avatar categories */}
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
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* Save button */}
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

// Skeleton Loader
const AvatarSelectorSkeleton = () => {
  return (
    <div className="bg-black text-white min-h-screen animate-pulse">
      <div className="flex items-center">
        <div className="size-8 bg-gray-700 rounded-full" />
      </div>
      <div className="text-center">
        <div className="h-8 w-24 mb-4 bg-gray-600 mx-auto rounded" />
        <div className="size-24 bg-gray-700 rounded-full mx-auto mb-2" />
        <div className="h-4 w-24 mb-6 bg-gray-600 mx-auto rounded" />
        <div className="h-4 w-50 mb-8 bg-gray-600 mx-auto mt-2 rounded" />
      </div>
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
