import { MoviesProvider } from "./movies-context";
import { ModalSearchProvider } from "./modal-search-context";
import { LikedMoviesProvider } from "./liked-movies-context";
import { ModalAccountProvider } from "./modal-account-context";
import { ScheduleProvider } from "./schedule-context";

export default function AppProvider({ children }) {
  return (
    <MoviesProvider>
      <ScheduleProvider>
        <ModalSearchProvider>
          <ModalAccountProvider>
            <LikedMoviesProvider>{children}</LikedMoviesProvider>
          </ModalAccountProvider>
        </ModalSearchProvider>
      </ScheduleProvider>
    </MoviesProvider>
  );
}
