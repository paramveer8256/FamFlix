import { useState, useEffect, useRef } from "react";
import { useAuthUserStore } from "../store/authUser";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import DeleteConfirmationModal from "./DeleteModal";
import { motion, AnimatePresence } from "framer-motion";
const avatarCategories = {
  Classic: [
    "classic1.png",
    "classic2.png",
    "classic3.png",
    "classic4.png",
    "classic5.png",
    "classic6.jpg",
    "classic7.jpg",
    "classic8.jpg",
    "classic9.jpg",
    "classic10.jpg",
    "classic11.jpg",
    "classic12.jpg",
    // "classic13.jpg",
    // "classic14.jpg",
    // "classic15.jpg",
    // "classic16.jpg",
    // "classic17.jpg",
    // "classic18.jpg",
    // "classic19.jpg",
    // "classic20.jpg",
    // "classic21.jpg",
  ],
  Insane: [
    "insane1.jpg",
    "insane2.jpg",
    "insane3.jpg",
    "insane4.jpg",
    "insane5.jpg",
    "insane6.jpg",
    "insane7.jpg",
    "insane8.jpg",
    "insane9.jpg",
    "insane10.jpg",
    "insane11.jpg",
    "insane12.jpg",
    "insane13.jpg",
    "insane14.jpg",
    "insane15.jpg",
    // "insane16.jpg",
    // "insane17.jpg",
    // "insane18.jpg",
    // "insane19.jpg",
    // "insane20.jpg",
  ],
  Anime: [
    "anime1.jpg",
    "anime2.jpg",
    "anime3.jpg",
    "anime4.jpg",
    "anime5.jpg",
    "anime6.jpg",
    "anime7.jpg",
    "anime8.jpg",
    "anime9.jpg",
    "anime10.jpg",
    "anime11.jpg",
    "anime12.jpg",
    // "anime13.jpg",
    // "anime14.jpg",
    // "anime15.jpg",
    // "anime16.jpg",
    // "anime17.jpg",
    // "anime18.jpg",
    // "anime19.jpg",
    // "anime20.jpg",
  ],
  Funky: [
    "funky1.png",
    "funky2.jpg",
    "funky3.jpg",
    "funky4.jpg",
    "funky5.jpg",
    "funky6.png",
    "funky7.jpg",
    "funky8.jpg",
    "funky9.jpg",
    "funky10.jpg",
    "funky11.jpg",
    "funky12.jpg",
    // "funky13.jpg",
    // "funky14.jpg",
    // "funky15.jpg",
    // "funky16.jpg",
    // "funky17.jpg",
    // "funky18.jpg",
    // "funky19.jpg",
    // "funky20.jpg",
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
