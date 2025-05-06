import { MoviesProvider } from "./movies-context";
import { ModalSearchProvider } from "./modal-search-context";
import { LikedMoviesProvider } from "./liked-movies-context";
import { ModalAccountProvider } from "./modal-account-context";

export default function AppProvider({ children }) {
  return (
    <MoviesProvider>
      <ModalSearchProvider>
        <ModalAccountProvider>
          <LikedMoviesProvider>{children}</LikedMoviesProvider>
        </ModalAccountProvider>
      </ModalSearchProvider>
    </MoviesProvider>
  );
}
