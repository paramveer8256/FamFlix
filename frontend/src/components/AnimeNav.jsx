import {
  LogOut,
  Menu,
  House,
  Newspaper,
  History,
  ListCheck,
  Search
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnimeNav = () => {
  const { user, logout } = useAuthUserStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef();
  const [genres, setGenres] = React.useState([]);
  const [isMobile, setIsMobile] = React.useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  useEffect(() => {
    try {
      // Fetch genres from the API
      const fetchGenres = async () => {
        const response = await axios.get(
          "/api/v1/anime/genre"
        );
        setGenres(response.data.genres);
      };
      fetchGenres();
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, []);
  function handlelogout() {
    logout();
    navigate("/login");
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  return (
    <header className="max-w-6xl mx-auto flex flex-wrap justify-between items-center p-4 h-15">
      <div className="flex items-center justify-center gap-25 z-50 ">
        <Link to="/anime">
          <img
            src="/anime-logo.png"
            alt="Logo"
            className="w-32 sm:w-40 "
          />
        </Link>
        {/* desktop navbar items*/}
        <div className="hidden sm:flex gap-20 items-center">
          <Link to="/anime" className="hover:underline">
            Home
          </Link>
          <Link
            to="/anime/news"
            className="hover:underline"
          >
            Anime News
          </Link>
          <Link
            to="/anime/history"
            className="hover:underline"
          >
            History
          </Link>
          <Link
            to="/anime/watchlist"
            className="hover:underline"
          >
            Watch List
          </Link>
          <div
            ref={dropdownRef}
            className="relative dropdown"
          >
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className=" hover:underline cursor-pointer"
            >
              Genres
            </button>

            {isOpen && (
              <div className="absolute left-[-50px] mt-2 bg-white text-black rounded-md shadow-lg w-40 z-50 max-h-60 overflow-y-auto">
                {genres.map((genre) => (
                  <Link
                    to={`/genre/anime/${genre?.id}/${genre?.name}`}
                    key={genre?.id}
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setIsOpen(false)} // optional: close dropdown on click
                  >
                    {genre?.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center z-50">
        <Link to="/anime/search">
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar logo"
          className="size-12 md:size-14 rounded-full cursor-pointer"
          onClick={() => {
            navigate(`/anime/profile/${user.username}`);
          }}
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
        <div className="md:hidden z-90 absolute top-20 left-0 w-full bg-black border border-gray-800 rounded-md shadow-lg">
          <Link
            to="/anime"
            className="hover:underline block"
            onClick={() => {
              handleToggle();
            }}
          >
            <div className=" mx-2 mt-4 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <House
                className="size-5 mx-2"
                onClick={() => {
                  handleToggle();
                }}
              />
              Home
            </div>
          </Link>
          <Link
            to="/anime/news"
            className="hover:underline block"
            onClick={() => {
              handleToggle();
            }}
          >
            <div className=" m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <Newspaper
                className="size-5 mx-2"
                onClick={() => {
                  handleToggle();
                }}
              />
              Anime News
            </div>
          </Link>

          <Link
            to="/anime/history"
            className="hover:underline block"
            onClick={handleToggle}
          >
            <div className=" m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <History
                className="size-5 mx-2"
                onClick={handleToggle}
              />
              History
            </div>
          </Link>
          <Link
            to="/anime/watchlist"
            className="hover:underline block"
            onClick={handleToggle}
          >
            <div className=" m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <ListCheck
                className="size-5 mx-2"
                onClick={handleToggle}
              />
              Watch List
            </div>
          </Link>
          <div className=" m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
            <LogOut
              className="size-5 mx-2"
              onClick={handlelogout}
            />
            <p onClick={handlelogout}>Logout</p>
          </div>
          <Link
            to="#"
            className=" px-2 text-xl block text-red-500 "
          >
            Genres List
          </Link>
          <div className="px-2 pt-1 pb-4 flex flex-wrap text-xs gap-x-1 max-h-120 flex-col">
            {genres.map((genre) => (
              <Link
                to={`/genre/anime/${genre?.id}/${genre?.name}`}
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

export default AnimeNav;
