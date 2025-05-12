import MoviePoster from "../../components/movie-poster/movie-poster";
import { useLikedMovies } from "../../context/liked-movies-context";

export default function Favorites() {
  const { likedMovies } = useLikedMovies();

  return (
    <div className="!px-3 sm:!px-6 !pb-12">
      <h1 className="text-4xl font-bold text-white !mb-10">
        Your favorite movies
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-h-[200vh] overflow-auto">
        {likedMovies.map((movie) => (
          <MoviePoster
            key={movie.id}
            movie={movie}
            className="!h-[400px] md:!h-[500px]"
            classNameImg="!h-[400px] md:!h-[500px]"
          />
        ))}
      </div>
    </div>
  );
}
