import { LogOut, Menu, Search } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthUserStore } from "../store/authUser.js";
import { useContentStore } from "../store/content.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Film as MovieIcon,
  Video,
  History,
  ListCheck,
} from "lucide-react";
const Navbar = () => {
  const { user, logout } = useAuthUserStore();
  const { contentType, setContentType } = useContentStore();
  const [genres, setGenres] = React.useState([]);
  const [isMobile, setIsMobile] = React.useState(false);
  const handleToggle = () => {
    setIsMobile(!isMobile);
  };
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Fetch genres from the API
      const fetchGenres = async () => {
        const response = await axios.get(
          `/api/v1/${contentType}/genre`
        );
        setGenres(response.data.genres);
      };
      fetchGenres();
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }, [contentType]);
  return (
    <header className="max-w-6xl mx-auto flex flex-wrap justify-between items-center p-4 h-15">
      <div className="flex items-center justify-center gap-25 z-50 ">
        <Link to="/">
          <img
            src="/famflix logo wobg.png"
            alt="Logo"
            className="w-32 sm:w-40 "
          />
        </Link>
        {/* desktop navbar items*/}
        <div className="hidden sm:flex gap-20 items-center">
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
            onClick={() => setContentType("tv")}
          >
            TV Shows
          </Link>
          <Link to="/history" className="hover:underline">
            History
          </Link>
          <Link to="/watchlist" className="hover:underline">
            Watch List
          </Link>
          <div className="dropdown">
            <Link to="#" className="dropbtn">
              Genres
            </Link>
            <div className="dropdown-content z-50">
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-2 ">
                {genres.map((genre) => (
                  <Link
                    to={`/genre/${contentType}/${genre?.id}/${genre?.name}`}
                    key={genre?.id}
                    className="py-1 px-2.5"
                  >
                    {genre?.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-center z-50">
        <Link to="/search">
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar logo"
          className="size-12 md:size-14 rounded-full cursor-pointer"
          onClick={() => {
            navigate(`/profile/${user.username}`);
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
            to="/"
            className="hover:underline block"
            onClick={() => {
              handleToggle();
              setContentType("movie");
            }}
          >
            <div className=" mx-2 mt-4 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <MovieIcon
                className="size-5 mx-2"
                onClick={() => {
                  handleToggle();
                  setContentType("tv");
                }}
              />
              Movies
            </div>
          </Link>
          <Link
            to="/"
            className="hover:underline block"
            onClick={() => {
              handleToggle();
              setContentType("tv");
            }}
          >
            <div className=" m-2 flex items-center gap-1 hover:bg-gray-800 cursor-pointer">
              <Video
                className="size-5 mx-2"
                onClick={() => {
                  handleToggle();
                  setContentType("tv");
                }}
              />
              TV Shows
            </div>
          </Link>

          <Link
            to="/history"
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
            to="/watchlist"
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
              onClick={() => {
                logout();
                navigate("/login");
              }}
            />
            <p
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </p>
          </div>
          <Link
            to="#"
            className=" px-2 text-xl block text-[#1E90FF] "
          >
            Genres List
          </Link>
          <div className="px-4 pt-1 pb-4 flex flex-wrap text-sm gap-x-2 max-h-35 flex-col">
            {genres.map((genre) => (
              <Link
                to={`/genre/${contentType}/${genre?.id}/${genre?.name}`}
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
