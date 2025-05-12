import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLikedMovies } from "../../context/liked-movies-context";

function ActionButton({ onClick, icon, text, rotateIcon = false }) {
  return (
    <div
      className="flex gap-2 items-center cursor-pointer group"
      onClick={onClick}
    >
      <div className="bg-white/30 backdrop-blur-md h-14 w-16 flex items-center justify-center group-hover:bg-red-500 transition-colors rounded-md">
        <img
          src={icon}
          alt="icon"
          className={`h-10 w-auto ${rotateIcon ? "transform rotate-180" : ""}`}
        />
      </div>
      <span>{text}</span>
    </div>
  );
}

export default function MoviePoster({
  movie,
  className = "",
  classNameImg = "",
  isInModal = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const viewMoreDetails = useCallback(
    (id, title) => {
      navigate(`/movie/${id}/${title}`);
    },
    [navigate]
  );

  const viewTrailer = useCallback((url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const { toggleLike, isLiked } = useLikedMovies();

  return (
    <div
      className={`relative inline-block w-full h-screen ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className={`w-full h-screen transition duration-300 object-cover ease-in-out ${
          isHovered ? "blur-sm " : ""
        } ${classNameImg}`}
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 transition duration-300 ease-in-out z-10" />
      )}
      {!isInModal && (
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      )}
      {!isInModal && (
        <div className="absolute top-[60%] min-[400px]:top-[65%] md:top-[75%] left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold text-center w-[90%] z-20 flex flex-col gap-2">
          <h4 className="text-white text-3xl font-bold">{movie.title}</h4>
          <p className="text-lg text-gray-300 mt-1 flex items-center justify-center">
            {movie.genre.join(", ")} • {movie.year} • ⭐{movie.rating} •{" "}
            {movie.ageRestriction}
          </p>
        </div>
      )}
      {isHovered && (
        <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[90%] text-white text-xl font-semibold flex flex-col gap-10 z-20">
          <ActionButton
            onClick={() => viewMoreDetails(movie.id, movie.title)}
            icon="./assets/icons/information-icon-white.png"
            text="More about the movie"
          />
          <ActionButton
            onClick={() => viewTrailer(movie.trailer)}
            icon="./assets/icons/white-play-icon.png"
            text="Watch trailer"
          />
          <ActionButton
            onClick={() => toggleLike(movie)}
            icon="./assets/icons/like.png"
            text={
              isLiked(movie.id) ? "Remove from favorites" : "Add to favorites"
            }
            rotateIcon={isLiked(movie.id)}
          />
        </div>
      )}
    </div>
  );
}
