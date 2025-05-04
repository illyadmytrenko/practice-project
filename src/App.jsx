import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import Home from "./pages/home/page";
import Movie from "./pages/movie/page";
import Favorites from "./pages/favorites/page";
import Schedule from "./pages/schedule/page";
import AppProvider from "./context/app-provider";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id" element={<Movie />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="schedule" element={<Schedule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
