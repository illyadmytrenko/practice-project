import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MoviePoster({ moviePoster }) {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const viewMoreDetails = (id) => {
    navigate(`/movie/${id}`);
  };

  const viewTrailer = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="relative inline-block w-full h-screen"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={moviePoster.poster}
        alt={moviePoster.title}
        className={`w-full h-screen transition duration-300 ease-in-out ${
          isHovered ? "blur-sm " : ""
        }`}
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 transition duration-300 ease-in-out z-10" />
      )}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      <h4 className="absolute top-[75%] left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold text-center w-[90%] z-20">
        {moviePoster.title}
      </h4>
      {isHovered && (
        <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[90%] text-white text-xl font-semibold flex justify-between gap-10 z-20">
          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => viewMoreDetails(moviePoster.id)}
          >
            <div className="bg-white/30 backdrop-blur-md h-14 w-16 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
              <img
                src="./assets/icons/information-icon-white.png"
                alt="info icon"
                className="h-10 w-auto"
              />
            </div>
            <span>Детальніше про фільм</span>
          </div>
          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => viewTrailer(moviePoster.trailer)}
          >
            <div className="bg-white/30 backdrop-blur-md h-14 w-16 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
              <img
                src="./assets/icons/white-play-icon.png"
                alt="play icon"
                className="h-10 w-auto"
              />
            </div>
            <span>Дивитися трейлер</span>
          </div>
        </div>
      )}
    </div>
  );
}
