import { LogOut, Menu, Search } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser.js";
import { useContentStore } from "../store/content.js";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuthUserStore();
  const { setContentType } = useContentStore();
  const [genres, setGenres] = React.useState([]);
  const [isMobile, setIsMobile] = React.useState(false);
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  useEffect(() => {
    try {
      // Fetch genres from the API
      const fetchGenres = async () => {
        const response = await axios.get(
          "/api/v1/movie/genre"
        );
        setGenres(response.data.genres);
      };
      fetchGenres();
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);
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
        <div className="hidden ml-20 sm:flex gap-20 items-center">
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
          <Link to="/watchlist" className="hover:underline">
            Watchlist
          </Link>
          <div className="dropdown">
            <Link to="#" className="dropbtn">
              Genres
            </Link>
            <div className="dropdown-content z-50">
              <div className="genre-container ">
                {genres.map((genre) => (
                  <Link
                    to={`/genre/${genre?.id}/${genre?.name}`}
                    key={genre?.id}
                  >
                    {genre?.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        <Link to="/search">
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar logo"
          className="h-6 rounded cursor-pointer"
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
        <div className="sm:hidden z-90 absolute top-20 left-0 w-full bg-black border border-gray-800 rounded-md shadow-lg">
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
          <Link
            to="/watchlist"
            className="hover:underline p-2 block"
            onClick={handleToggle}
          >
            Watchlist
          </Link>
          <Link
            to="#"
            className=" px-2 text-xl block text-[#1E90FF] "
          >
            Genres List
          </Link>
          <div className="px-4 py-1 flex flex-wrap text-sm gap-x-5 max-h-35 flex-col">
            {genres.map((genre) => (
              <Link
                to={`/genre/${genre?.id}/${genre?.name}`}
                key={genre?.id}
                className="py-0.5"
              >
                {genre?.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
