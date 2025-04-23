import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Movie() {
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
      className="relative inline-block bg-amber-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="./assets/sample.png"
        alt="Spider-Man"
        className={`max-w-full h-screen transition duration-300 ease-in-out ${
          isHovered ? "blur-sm" : ""
        }`}
      />
      <h4 className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
        Людина-Павук
      </h4>
      {isHovered && (
        <div className="absolute top-1/5 left-[5%] text-white text-xl font-semibold flex justify-between gap-10">
          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => viewMoreDetails(1)}
          >
            <div className="bg-white/30 backdrop-blur-md h-12 w-12 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
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
            onClick={() =>
              viewTrailer("https://youtu.be/t06RUxPbp_c?si=SoV4BvxNTh8u_YYK")
            }
          >
            <div className="bg-white/30 backdrop-blur-md h-12 w-12 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
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
