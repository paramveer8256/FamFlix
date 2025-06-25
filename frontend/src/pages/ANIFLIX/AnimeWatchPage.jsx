import AnimeNav from "../../components/AnimeNav.jsx";
import { useParams } from "react-router-dom";
export const AnimeWatchPage = () => {
  const { id } = useParams();
  const ep = 1;
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto container h-full">
        <AnimeNav />
        <div className="relative w-full h-full mb-4 aspect-video">
          <iframe
            src={`https://vidsrc.cc/v2/embed/anime/ani${id}/${ep}/sub`}
            width="95%"
            height="90%"
            referrerPolicy="origin"
            allowFullScreen
            className=" mx-auto border-2 lg:hidden border-red-500 rounded mt-4"
          ></iframe>

          {/* desktop */}
          <iframe
            src={`https://vidsrc.cc/v2/embed/anime/ani${id}/${ep}/dub`}
            width="80%"
            height="65%"
            referrerPolicy="origin"
            allowFullScreen
            className=" lg:block hidden mx-auto rounded-xl mt-4 border-2 border-red-500"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
export default AnimeWatchPage;
