import { Routes, Route, Link } from "react-router-dom";
import Favorites from "./pages/favorites";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Головна сторінка</Link> |{" "}
        <Link to="/favorites">Обрані</Link>
      </nav>
      <Routes>
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;
