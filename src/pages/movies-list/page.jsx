import React, { useEffect, useState } from "react";
import MoviePoster from "../../components/movie-poster/movie-poster";
import { useMovies } from "../../context/movies-context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CustomInput from "../../components/custom-input/custom-input";

export default function MoviesList() {
  const { movies } = useMovies();
  const [shownMovies, setShownMovies] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    genres: [],
    years: [],
    minRating: "",
    ageRestrictions: [],
    sortOption: "",
  });

  const allGenres = [...new Set(movies.flatMap((movie) => movie.genre))];
  const allYears = [...new Set(movies.map((movie) => movie.year))].sort(
    (a, b) => b - a
  );
  const allAgeRestrictions = [
    ...new Set(movies.flatMap((movie) => movie.ageRestriction)),
  ].sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    return numA - numB;
  });

  useEffect(() => {
    setShownMovies(movies);
  }, [movies]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      genres: [],
      years: [],
      minRating: "",
      ageRestrictions: [],
      sortOption: "",
    });
  };

  useEffect(() => {
    setShownMovies(
      movies
        .filter((movie) =>
          filters.searchTerm
            ? movie.title
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase()) ||
              movie.originalTitle
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase())
            : true
        )
        .filter((movie) =>
          filters.genres.length > 0
            ? movie.genre.some((g) => filters.genres.includes(g))
            : true
        )
        .filter((movie) =>
          filters.years.length > 0 ? filters.years.includes(movie.year) : true
        )
        .filter((movie) =>
          filters.minRating ? movie.rating >= +filters.minRating : true
        )
        .filter((movie) =>
          filters.ageRestrictions.length > 0
            ? filters.ageRestrictions.includes(movie.ageRestriction)
            : true
        )
        .sort((a, b) => {
          switch (filters.sortOption) {
            case "rating-desc":
              return b.rating - a.rating;
            case "rating-asc":
              return a.rating - b.rating;
            case "title-asc":
              return a.title.localeCompare(b.title);
            case "title-desc":
              return b.title.localeCompare(a.title);
            default:
              return 0;
          }
        })
    );
  }, [movies, filters]);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#333333",
      borderColor: state.hasValue ? "green" : "#333333",
      boxShadow: state.hasValue ? "0 0 0 1px green" : "none",
      color: "white",
      "&:hover": {
        borderColor: state.hasValue ? "green" : "#555555",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444444" : "#333333",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#333333",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#555555",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#777777",
        color: "black",
      },
    }),
  };

  const animatedComponents = makeAnimated();

  return (
    <div className="flex flex-col !px-3 sm:!px-6 !pb-12 text-white gap-6 z-50">
      <h1 className="text-4xl font-bold text-white !mb-6">Find your movie</h1>
      <CustomInput
        type="text"
        placeholder="Search by title"
        value={filters.searchTerm}
        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        className="w-full max-w-xl text-xl text-black"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <Select
          isMulti
          placeholder="All genres"
          options={allGenres.map((g) => ({ value: g, label: g }))}
          onChange={(e) =>
            handleFilterChange(
              "genres",
              e.map((option) => option.value)
            )
          }
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
        ></Select>
        <Select
          isMulti
          placeholder="All years"
          options={allYears.map((y) => ({ value: y, label: y }))}
          onChange={(e) =>
            handleFilterChange(
              "years",
              e.map((option) => option.value)
            )
          }
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
        ></Select>
        <Select
          placeholder="Any rating"
          options={[
            { value: "5", label: "5+" },
            { value: "6", label: "6+" },
            { value: "7", label: "7+" },
            { value: "8", label: "8+" },
          ]}
          onChange={(e) => handleFilterChange("minRating", e.value)}
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
        ></Select>
        <Select
          isMulti
          placeholder="Age restriction"
          options={allAgeRestrictions.map((a) => ({ value: a, label: a }))}
          onChange={(e) =>
            handleFilterChange(
              "ageRestrictions",
              e.map((option) => option.value)
            )
          }
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
        />
        <Select
          placeholder="Sort by"
          options={[
            { value: "rating-desc", label: "Rating: High to Low" },
            { value: "rating-asc", label: "Rating: Low to High" },
            { value: "title-asc", label: "Title: A-Z" },
            { value: "title-desc", label: "Title: Z-A" },
          ]}
          onChange={(e) => handleFilterChange("sortOption", e.value)}
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
        />
        <button
          onClick={resetFilters}
          className="w-full !p-2 text-xl text-white bg-green-600 hover:bg-green-800 transition !border-1 !border-gray-100 rounded-md"
        >
          Clear filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {shownMovies.length > 0 ? (
          shownMovies.map((movie) => (
            <MoviePoster
              key={movie.id}
              movie={movie}
              className="!h-[400px] md:!h-[500px]"
              classNameImg="!h-[400px] md:!h-[500px]"
            />
          ))
        ) : (
          <div className="col-span-4 flex flex-col justify-center">
            <img
              src="./assets/icons/not-found.png"
              alt="not found icon"
              className="h-[400px] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
