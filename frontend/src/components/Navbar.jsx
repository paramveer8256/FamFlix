import { LogOut, Menu, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser.js";
import { useContentStore } from "../store/content.js";

const Navbar = () => {
  const { user, logout } = useAuthUserStore();
  const {setContentType } = useContentStore();

  const [isMobile, setIsMobile] = React.useState(false);
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };
  return (
    <header className="  max-w-6xl mx-auto flex flex-wrap justify-between items-center p-4 h-20">
      <div className="flex items-center justify-center gap-10 z-50 ">
        <Link to="/">
          <img
            src="/famflix logo wobg.png"
            alt="Logo"
            className="w-32 sm:w-40 "
          />
        </Link>
        {/* desktop navbar items*/}
        <div className="hidden ml-40 sm:flex gap-30 items-center">
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("anime")}
          >
            Animes
          </Link>
          <Link to="/history" className="hover:underline">
            Search History
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        <Link to="/search">
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar logo"
          className="h-8 rounded cursor-pointer"
        />
        <LogOut
          className="size-6 cursor-pointer"
          onClick={logout}
        />
        <div className="sm:hidden">
          <Menu
            className="size-6 cursor-pointer"
            onClick={handleToggle}
          />
        </div>
      </div>

      {/*mobile nav items */}
      {isMobile && (
        <div className="sm:hidden z-50 absolute top-20 left-0 w-full bg-black border border-gray-800 rounded-md shadow-lg">
          <Link
            to="/"
            className="hover:underline p-2 block"
            onClick={handleToggle}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline p-2 block"
            onClick={handleToggle}
          >
            Animes
          </Link>
          <Link
            to="/history"
            className="hover:underline p-2 block"
            onClick={handleToggle}
          >
            Search History
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
