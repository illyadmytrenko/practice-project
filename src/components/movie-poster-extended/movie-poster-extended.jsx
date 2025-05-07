import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLikedMovies } from "../../context/liked-movies-context";

export default function MoviePosterExtended({
  movie,
  className = "",
  classNameImg = "",
  isInModal = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { toggleLike, isLiked } = useLikedMovies();

  const viewMoreDetails = (id) => {
    navigate(`/movie/${id}`);
  };

  const viewTrailer = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`relative w-full h-[420px] rounded overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Постер */}
      <img
        src={movie.poster}
        alt={movie.title}
        className={`w-full h-full object-cover transition duration-300 ease-in-out ${
          isHovered ? "blur-sm" : ""
        } ${classNameImg}`}
      />

      {/* Підсвітка при hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 transition duration-300 ease-in-out z-10" />
      )}

      {/* Градієнт знизу */}
      {!isInModal && (
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      )}

      {/* Назва */}
      {!isInModal && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] text-center z-20">
          <h4 className="text-white text-lg font-bold">{movie.title}</h4>
          <p className="text-sm text-gray-300 mt-1">
            {movie.genre.join(", ")} • {movie.year} • ⭐ {movie.rating} • {movie.language}
          </p>
        </div>
      )}

      {/* Кнопки при hover */}
      {isHovered && (
        <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[90%] text-white text-sm font-medium flex flex-col gap-6 z-20">
          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => viewMoreDetails(movie.id)}
          >
            <div className="bg-white/30 backdrop-blur-md h-12 w-12 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
              <img
                src="./assets/icons/information-icon-white.png"
                alt="info icon"
                className="h-8 w-auto"
              />
            </div>
            <span>Детальніше</span>
          </div>

          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => viewTrailer(movie.trailer)}
          >
            <div className="bg-white/30 backdrop-blur-md h-12 w-12 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
              <img
                src="./assets/icons/white-play-icon.png"
                alt="play icon"
                className="h-8 w-auto"
              />
            </div>
            <span>Дивитись трейлер</span>
          </div>

          <div
            className="flex gap-2 items-center cursor-pointer group"
            onClick={() => toggleLike(movie)}
          >
            <div className="bg-white/30 backdrop-blur-md h-12 w-12 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
              <img
                src="./assets/icons/like.png"
                alt="like icon"
                className={`h-8 w-auto ${
                  isLiked(movie.id) ? "transform rotate-180" : ""
                }`}
              />
            </div>
            <span>
              {isLiked(movie.id) ? "В улюблених" : "У вибране"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
