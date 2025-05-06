import { useEffect, useState } from "react";
import { useModalSearch } from "../../context/modal-search-context";
import { useMovies } from "../../context/movies-context";
import MoviePoster from "../movie-poster/movie-poster";
import ModalWindow from "../modal-window/modal-window";

export default function ModalSearch() {
  const { movies } = useMovies();
  const { isModalWindowSearchOpen, setIsModalWindowSearchOpen, searchString } =
    useModalSearch();

  const [foundMovies, setFoundMovies] = useState([]);

  useEffect(() => {
    const filteredMovies = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(searchString.toLowerCase()) ||
        m.originalTitle.toLowerCase().includes(searchString.toLowerCase())
    );
    setFoundMovies(filteredMovies);
  }, [movies, searchString]);

  if (!isModalWindowSearchOpen) return null;

  return (
    <ModalWindow
      title="Founded Movies"
      onClose={() => setIsModalWindowSearchOpen(false)}
    >
      {foundMovies.length === 0 ? (
        <div className="h-full">
          <img
            src="./assets/icons/not-found.png"
            alt="not found icon"
            className="h-full"
          />
        </div>
      ) : (
        foundMovies.map((movie) => (
          <MoviePoster
            key={movie.id}
            movie={movie}
            className="!h-full"
            classNameImg="!h-full"
            isInModal
          />
        ))
      )}
    </ModalWindow>
  );
}
