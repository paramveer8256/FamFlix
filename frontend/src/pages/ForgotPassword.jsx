import React from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser";

const ForgotPassword = () => {
  const { forgotPassword } = useAuthUserStore();
  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const success = await forgotPassword({ email });

    if (success) {
      setEmailSent(true);
    }
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
          {!emailSent ? (
            <>
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
            </>
          ) : (
            <>
              <h1 className="text-center text-white text-2xl font-bold">
                Check Your Email
              </h1>

              <p className="text-gray-300 text-center mt-4">
                If an account exists for <b>{email}</b>, a password reset link
                has been sent.
              </p>

              <p className="text-gray-400 text-center text-sm mt-2">
                Please check your inbox and follow the instructions to reset
                your password.
              </p>

              <Link
                to="/login"
                className="block text-center mt-6 bg-[#1E90FF] py-2 rounded-md text-white font-semibold hover:bg-[#1f88e5]"
              >
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
