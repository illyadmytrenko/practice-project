import { useNavigate } from "react-router-dom";

export default function MoviePosterWithoutInfo({ movie, goToMovie }) {
  const navigate = useNavigate();

  return (
    <div
      key={movie.id}
      onClick={() => goToMovie(navigate, movie.id, movie.title)}
      className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform !p-2"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-[400px] object-cover rounded-xl shadow-md"
      />
      <p className="!mt-2 text-center text-lg font-semibold text-white">
        {movie.title}
      </p>
    </div>
  );
}
