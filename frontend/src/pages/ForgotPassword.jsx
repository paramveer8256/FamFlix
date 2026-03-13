import React from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser";

const ForgotPassword = () => {
  const { forgotPassword } = useAuthUserStore();
  const [email, setEmail] = React.useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();

    forgotPassword({
      email,
    });
  };

  return (
    <div className="h-screen w-full hero-bg">
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
            Forgot Password
          </h1>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-gray-300 font-medium block">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
              />
            </div>

            <button className="w-full py-2 bg-[#1E90FF] hover:bg-[#1f88e5] active:bg-[#529af1] text-white font-semibold rounded-md">
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-gray-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-[#1E90FF] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
