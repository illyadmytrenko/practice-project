import { useMemo } from "react";
import { useModalSearch } from "../../context/modal-search-context";
import { useMovies } from "../../context/movies-context";
import MoviePoster from "../movie-poster/movie-poster";
import ModalWindow from "../modal-window/modal-window";

export default function ModalSearch() {
  const { movies } = useMovies();
  const {
    isModalWindowSearchOpen,
    setIsModalWindowSearchOpen,
    searchString,
    setSearchString,
  } = useModalSearch();

  const foundMovies = useMemo(() => {
    return movies.filter((m) =>
      m.title.toLowerCase().includes(searchString.toLowerCase())
    );
  }, [movies, searchString]);

  if (!isModalWindowSearchOpen) return null;

  return (
    <ModalWindow
      title="Found Movies"
      onClose={() => {
        setIsModalWindowSearchOpen(false);
        setSearchString("");
      }}
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
