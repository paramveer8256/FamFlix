import React from "react";
import { useAuthUserStore } from "../store/authUser";
import { Link } from "react-router-dom";
const SignupPage = () => {
  const { searchParams } = new URL(document.location);
  const emailParam = searchParams.get("email");
  const [email, setEmail] = React.useState(
    emailParam || ""
  );
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] =
    React.useState(false);

  const { signup,isSigningUp } = useAuthUserStore();

  function handleSignUp(e) {
    e.preventDefault();
    signup({ email, username, password });
  }

  return (
    <div
      className="h-screen w-full hero-bg"
      onSubmit={handleSignUp}
    >
      <header className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link to={"/"}>
          <img
            src="/famflix logo wobg.png"
            alt="Logo"
            className="w-40 pt-2"
          />
        </Link>
      </header>
      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md space-y-6 bg-black/60 rounded-lg shadow-md p-8">
          <h1 className="text-center text-white text-2xl font-bold mb-4">
            Create new account (Sign Up)
          </h1>
          <form action="" className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-gray-300 font-medium block text-sm"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="text-gray-300 font-medium block text-sm"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-gray-300 font-medium block text-sm"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 mb-1 rounded-md border border-gray-700 text-white bg-transparent focus:outline-none focus:ring"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
               
              <label className="text-gray-300 pl-0.5 font-semibold  cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() =>
                    setShowPassword(!showPassword)
                  }
                />
              </label>
            </div>
            <button
            disabled={isSigningUp}
             className="w-full py-2 bg-[#1E90FF] hover:bg-[#1f88e5] active:bg-blue-200 text-white font-semibold rounded-md">
              {isSigningUp ? "Signing up" : "Sign Up"}
            </button>
          </form>
          <div className="text-center text-gray-400 mt-4">
            Already a member?{" "}
            <Link
              to={"/login"}
              className="text-[#1E90FF] font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
