import Navbar from "../components/Navbar.jsx";

export const AnimeWatchPage = () => {
  const id = 5114;
  const ep = 1;
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="mx-auto container h-full">
        <Navbar />
        <iframe
          src={`https://vidsrc.cc/v2/embed/anime/${id}/${ep}/dub?autoPlay=false`}
          width="95%"
          height="90%"
          referrerPolicy="origin"
          allowFullScreen
          className=" mx-auto border-2 lg:hidden border-[#FF69B4] rounded mt-4"
        ></iframe>
        {/* desktop */}
        <div className="relative w-full h-full mb-4 aspect-video">
          <iframe
            src={`https://vidsrc.cc/v2/embed/anime/${id}/${ep}/dub?autoPlay=false`}
            width="80%"
            height="65%"
            referrerPolicy="origin"
            allowFullScreen
            className=" lg:block hidden mx-auto rounded-xl mt-4 border-2 border-[#FF69B4]"
          ></iframe>
        </div>
        
      </div>
    </div>
  );
};
