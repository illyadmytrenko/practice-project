import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import Home from "./pages/home/page";
import Movie from "./pages/movie/page";
import Favorites from "./pages/favorites/page";
import Schedule from "./pages/schedule/page";
import MoviesList from "./pages/movies-list/page";
import AppProvider from "./context/app-provider";
import PersonalAccount from "./pages/personal-account/page";
import Privacy from "./pages/privacy/page";
import { useModalAccount } from "./context/modal-account-context";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  const { setIsModalWindowAccountOpen } = useModalAccount();

  if (!token) {
    setIsModalWindowAccountOpen(true);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id/:title" element={<Movie />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="movies-list" element={<MoviesList />} />
            <Route path="privacy" element={<Privacy />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <PersonalAccount />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
