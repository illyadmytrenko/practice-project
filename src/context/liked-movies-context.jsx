import React, { createContext, useContext, useState, useEffect } from "react";

const LikedMoviesContext = createContext();

const LOCAL_STORAGE_KEY = "likedMovies";

export const LikedMoviesProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setLikedMovies(JSON.parse(stored));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(likedMovies));
    }
  }, [likedMovies, isInitialized]);

  const toggleLike = (movie) => {
    setLikedMovies((prev) => {
      const isAlreadyLiked = prev.some((m) => m.id === movie.id);
      if (isAlreadyLiked) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isLiked = (id) => likedMovies.some((m) => m.id === id);

  return (
    <LikedMoviesContext.Provider value={{ likedMovies, toggleLike, isLiked }}>
      {children}
    </LikedMoviesContext.Provider>
  );
};

export const useLikedMovies = () => {
  const context = useContext(LikedMoviesContext);
  if (!context) {
    throw new Error("useLikedMovies must be used within LikedMoviesProvider");
  }
  return context;
};
