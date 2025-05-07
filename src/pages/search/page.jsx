import React, { useEffect, useState } from "react";
import MoviePosterExtended from "../../components/movie-poster-extended/movie-poster-extended";

export default function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");
  const [language, setLanguage] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetch("/server/movies.json")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Failed to load movies:", err));
  }, []);

  const allGenres = [...new Set(movies.flatMap((movie) => movie.genre))];
  const allYears = [...new Set(movies.map((movie) => movie.year))].sort((a, b) => b - a);

  const resetFilters = () => {
    setSearchTerm("");
    setGenre("");
    setYear("");
    setMinRating("");
    setLanguage("");
    setSortOption("");
  };

  let filtered = movies.filter((movie) => {
    const matchTitle = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = genre ? movie.genre.includes(genre) : true;
    const matchYear = year ? movie.year === +year : true;
    const matchRating = minRating ? movie.rating >= +minRating : true;
    const matchLanguage = language ? movie.language === language : true;
    return matchTitle && matchGenre && matchYear && matchRating && matchLanguage;
  });

  if (sortOption === "rating-desc") {
    filtered = filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === "rating-asc") {
    filtered = filtered.sort((a, b) => a.rating - b.rating);
  } else if (sortOption === "title-asc") {
    filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "title-desc") {
    filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 text-white gap-6 z-50">
      {/* === Заголовок === */}
      <h1 className="text-4xl font-bold text-white !mb-10"> Find your movie</h1>

      {/* === Пошук за назвою === */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-8 py-4 text-xl text-white bg-neutral-800/70 border border-gray-600 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* === Блок фільтрів і сортування === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Фільтр за жанром */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full px-6 py-6 text-xl text-white bg-neutral-800/70 border border-gray-600 focus:outline-none"
        >
          <option value="">All genres</option>
          {allGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Фільтр за роком */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-6 py-6 text-xl text-white bg-neutral-800/70 border border-gray-600 focus:outline-none"
        >
          <option value="">All years</option>
          {allYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Фільтр за рейтингом */}
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full px-6 py-6 text-xl text-white bg-neutral-800/70 border border-gray-600 focus:outline-none"
        >
          <option value="">Any rating</option>
          <option value="5">5+</option>
          <option value="6">6+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
        </select>

        {/* Фільтр за мовою */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-6 py-6 text-xl text-white bg-neutral-800/70 border border-gray-600 focus:outline-none"
        >
          <option value="">All languages</option>
          <option value="Ukrainian">Ukrainian</option>
          <option value="English">English</option>
          <option value="Original">Original</option>
        </select>

        {/* Сортування */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full px-6 py-6 text-xl text-white bg-neutral-800/70 border border-gray-600 focus:outline-none"
        >
          <option value="">Sort by</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="rating-asc">Rating: Low to High</option>
          <option value="title-asc">Title: A-Z</option>
          <option value="title-desc">Title: Z-A</option>
        </select>

        {/* Кнопка очищення */}
        <button
          onClick={resetFilters}
          className="w-full px-6 py-6 text-xl text-white hover:bg-gray-700 transition"
        >
          Clear filters
        </button>
      </div>

      {/* === Вивід результатів === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.length > 0 ? (
          filtered.map((movie) => (
            <MoviePosterExtended
              key={movie.id}
              movie={movie}
              className="!h-[420px]"
              classNameImg="!h-[420px]"
            />
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            No movies found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
