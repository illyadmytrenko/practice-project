import { MoviesProvider } from "./movies-context";
import { ModalSearchProvider } from "./modal-search-context";
import { LikedMoviesProvider } from "./liked-movies-context";

export default function AppProvider({ children }) {
  return (
    <MoviesProvider>
      <ModalSearchProvider>
        <LikedMoviesProvider>{children}</LikedMoviesProvider>
      </ModalSearchProvider>
    </MoviesProvider>
  );
}
