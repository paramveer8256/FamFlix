import { useState, useEffect, useRef } from "react";
import { useAuthUserStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import DeleteConfirmationModal from "./DeleteModal";
import { motion, AnimatePresence } from "framer-motion";
const avatarCategories = {
  Classic: [
    "classic-1.png",
    "classic-2.png",
    "classic-3.png",
    "classic-4.png",
    "classic-5.png",
    "classic-6.jpg",
    "classic-7.jpg",
    "classic-8.jpg",
    "classic-9.jpg",
    "classic-10.jpg",
    "classic-11.jpg",
    "classic-12.jpg",
    // "classic-13.jpg",
    // "classic-14.jpg",
    // "classic-15.jpg",
    // "classic-16.jpg",
    // "classic-17.jpg",
    // "classic-18.jpg",
    // "classic-19.jpg",
    // "classic-20.jpg",
    // "classic-21.jpg",
  ],
  Insane: [
    "insane-1.jpg",
    "insane-2.jpg",
    "insane-3.jpg",
    "insane-4.jpg",
    "insane-5.jpg",
    "insane-6.jpg",
    "insane-7.jpg",
    "insane-8.jpg",
    "insane-9.jpg",
    "insane-10.jpg",
    "insane-11.jpg",
    "insane-12.jpg",
    "insane-13.jpg",
    "insane-14.jpg",
    "insane-15.jpg",
    // "insane-16.jpg",
    // "insane-17.jpg",
    // "insane-18.jpg",
    // "insane-19.jpg",
    // "insane-20.jpg",
  ],
  Anime: [
    "anime-1.jpg",
    "anime-2.jpg",
    "anime-3.jpg",
    "anime-4.jpg",
    "anime-5.jpg",
    "anime-6.jpg",
    "anime-7.jpg",
    "anime-8.jpg",
    "anime-9.jpg",
    "anime-10.jpg",
    "anime-11.jpg",
    "anime-12.jpg",
    // "anime-13.jpg",
    // "anime-14.jpg",
    // "anime-15.jpg",
    // "anime-16.jpg",
    // "anime-17.jpg",
    // "anime-18.jpg",
    // "anime-19.jpg",
    // "anime-20.jpg",
  ],
  Funky: [
    "funky-1.png",
    "funky-2.jpg",
    "funky-3.jpg",
    "funky-4.jpg",
    "funky-5.jpg",
    "funky-6.png",
    "funky-7.jpg",
    "funky-8.jpg",
    "funky-9.jpg",
    "funky-10.jpg",
    "funky-11.jpg",
    "funky-12.jpg",
    // "funky-13.jpg",
    // "funky-14.jpg",
    // "funky-15.jpg",
    // "funky-16.jpg",
    // "funky-17.jpg",
    // "funky-18.jpg",
    // "funky-19.jpg",
    // "funky-20.jpg",
  ],
  Old: ["avatar1.png", "avatar2.png", "avatar3.png"],
};

const AvatarSelector = () => {
  const { user, updateInfo } = useAuthUserStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [editingUsername, setEditingUsername] =
    useState(false);
  // const [editingEmail, setEditingEmail] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email] = useState(user.email);
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
      // if (
      //   emailRef.current &&
      //   !emailRef.current.contains(event.target)
      // ) {
      //   setEditingEmail(false);
      // }
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
    const timer = setTimeout(() => setLoading(false), 2000);
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
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function handleClick() {
    setIsClicked(!isClicked);
  }
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
          <AnimatePresence>
            {isClicked && (
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClick}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                  className=" flex items-center justify-center"
                >
                  <img
                    src={selected}
                    alt="Selected Avatar"
                    className="size-70 md:size-100 rounded-full cursor-pointer"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <img
            src={selected}
            alt="Selected Avatar"
            className="size-24 rounded-full mx-auto mt-4 cursor-pointer"
            onClick={handleClick}
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
            {/* {editingEmail ? (
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
            ) : null} */}
            <p className="h-6 leading-6">{email}</p>
            {/* <PencilIcon
              size={16}
              className="cursor-pointer"
              onClick={() =>
                setEditingEmail((prev) => !prev)
              }
            /> */}
          </div>
        </div>

        {/* Avatar categories */}
        {Object.entries(avatarCategories).map(
          ([category, avatars]) => (
            <div key={category} className="mb-4">
              <h3 className="text-md font-bold mb-2">
                {category}
              </h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide ">
                {avatars.map((avatar) => {
                  const imgPath = `/avatars/${category
                    .toLowerCase()
                    .replace(/ /g, "-")}/${avatar}`;
                  return (
                    <img
                      key={avatar}
                      src={imgPath}
                      alt={avatar}
                      loading="lazy"
                      onClick={() =>
                        handleSelect(
                          category
                            .toLowerCase()
                            .replace(/ /g, "-"),
                          avatar
                        )
                      }
                      className={`size-22 rounded-full cursor-pointer border-4 ${
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
        <div className="text-center mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-full cursor-pointer"
            onClick={openModal}
          >
            Done
          </button>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleSave()}
        title="Update Profile"
        message={`Are you sure you want to update your Profile?`}
      />
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
      {["Classic", "Anime", "Funky", "Insane", "Old"].map(
        (category) => (
          <div key={category} className="mb-6">
            <div className="h-4 w-24 bg-gray-600 mb-3 rounded" />
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                {Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="size-22 bg-gray-600 rounded-full"
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
