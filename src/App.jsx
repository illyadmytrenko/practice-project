import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main-layout";
import Home from "./pages/home/page";
import Movie from "./pages/movie/page";
import Favorites from "./pages/favorites/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="movie/:id" element={<Movie />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
