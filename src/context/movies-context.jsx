import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.error("Помилка при завантаженні фільмів:", err));
  }, []);

  return (
    <MoviesContext.Provider value={{ movies }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (!context) throw new Error("useMovies must be used inside MoviesProvider");
  return context;
}
