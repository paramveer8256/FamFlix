import React from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const { changePassword } = useAuthUserStore();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    changePassword({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="h-screen w-full hero-bg" onSubmit={handleChangePassword}>
      <header className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link to={"/"}>
          <img
            src="/famflix logo wobg.png"
            alt="Logo"
            width="160"
            height="40"
            className="w-40 pt-2 object-contain"
          />
        </Link>
      </header>

      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md space-y-6 bg-black/60 rounded-lg shadow-md p-8">
          <h1 className="text-center text-white text-2xl font-bold mb-4">
            Change Password
          </h1>

          <form className="space-y-4">
            <div>
              <label className="text-gray-300 font-medium block">
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium block">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-300 font-medium block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="w-full py-2 bg-[#1E90FF] hover:bg-[#1f88e5] active:bg-[#529af1] text-white font-semibold rounded-md">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
