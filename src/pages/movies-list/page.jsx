import { useEffect, useMemo, useState } from "react";
import MoviePoster from "../../components/movie-poster/movie-poster";
import { useMovies } from "../../context/movies-context";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CustomInput from "../../components/custom-input/custom-input";
import { selectStyles } from "../../constants/select-styles";

export default function MoviesList() {
  const animatedComponents = makeAnimated();

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

  const allGenres = useMemo(
    () => [...new Set(movies.flatMap((movie) => movie.genre))],
    [movies]
  );
  const allYears = useMemo(
    () => [...new Set(movies.map((movie) => movie.year))].sort((a, b) => b - a),
    [movies]
  );
  const allAgeRestrictions = useMemo(() => {
    return [...new Set(movies.map((m) => m.ageRestriction))].sort((a, b) => {
      return parseInt(a, 10) - parseInt(b, 10);
    });
  }, [movies]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      genres: [],
      years: [],
      minRating: "",
      ageRestrictions: [],
      sortOption: "",
    });
  };

  useEffect(() => {
    const filtered = movies
      .filter((movie) => {
        const term = filters.searchTerm.toLowerCase();
        return term
          ? movie.title.toLowerCase().includes(term) ||
              movie.originalTitle.toLowerCase().includes(term)
          : true;
      })
      .filter((movie) =>
        filters.genres.length
          ? movie.genre.some((g) => filters.genres.includes(g))
          : true
      )
      .filter((movie) =>
        filters.years.length ? filters.years.includes(movie.year) : true
      )
      .filter((movie) =>
        filters.minRating ? movie.rating >= +filters.minRating : true
      )
      .filter((movie) =>
        filters.ageRestrictions.length
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
      });

    setShownMovies(filtered);
  }, [movies, filters]);

  const createOptions = (arr) =>
    arr.map((item) => ({ value: item, label: item }));

  return (
    <div className="flex flex-col !px-3 sm:!px-6 !pb-12 text-white gap-6 z-50">
      <h1 className="text-4xl font-bold text-white !mb-6">Find your movie</h1>
      <CustomInput
        type="text"
        placeholder="Search by title"
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
        className="w-full max-w-xl text-xl text-black"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <Select
          isMulti
          placeholder="All genres"
          options={createOptions(allGenres)}
          value={createOptions(allGenres).filter((opt) =>
            filters.genres.includes(opt.value)
          )}
          onChange={(e) =>
            handleFilterChange(
              "genres",
              e.map((o) => o.value)
            )
          }
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
          noOptionsMessage={() => "No genres"}
        />
        <Select
          isMulti
          placeholder="All years"
          options={createOptions(allYears)}
          value={createOptions(allYears).filter((opt) =>
            filters.years.includes(opt.value)
          )}
          onChange={(e) =>
            handleFilterChange(
              "years",
              e.map((o) => o.value)
            )
          }
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
          noOptionsMessage={() => "No years"}
        />
        <Select
          placeholder="Any rating"
          options={[
            { value: "5", label: "5+" },
            { value: "6", label: "6+" },
            { value: "7", label: "7+" },
            { value: "8", label: "8+" },
          ]}
          value={
            filters.minRating
              ? { value: filters.minRating, label: `${filters.minRating}+` }
              : null
          }
          onChange={(e) => handleFilterChange("minRating", e.value)}
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
          isClearable
        />
        <Select
          isMulti
          placeholder="Age restriction"
          options={createOptions(allAgeRestrictions)}
          value={createOptions(allAgeRestrictions).filter((opt) =>
            filters.ageRestrictions.includes(opt.value)
          )}
          onChange={(e) =>
            handleFilterChange(
              "ageRestrictions",
              e.map((o) => o.value)
            )
          }
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
          noOptionsMessage={() => "No age restrictions"}
        />
        <Select
          placeholder="Sort by"
          options={[
            { value: "rating-desc", label: "Rating: High to Low" },
            { value: "rating-asc", label: "Rating: Low to High" },
            { value: "title-asc", label: "Title: A-Z" },
            { value: "title-desc", label: "Title: Z-A" },
          ]}
          value={
            filters.sortOption
              ? {
                  value: filters.sortOption,
                  label: {
                    "rating-desc": "Rating: High to Low",
                    "rating-asc": "Rating: Low to High",
                    "title-asc": "Title: A-Z",
                    "title-desc": "Title: Z-A",
                  }[filters.sortOption],
                }
              : null
          }
          onChange={(e) => handleFilterChange("sortOption", e.value)}
          styles={selectStyles}
          className="text-xl"
          components={animatedComponents}
          isClearable
        />
        <button
          onClick={resetFilters}
          className="w-full !p-2 text-xl text-white bg-green-600 hover:bg-green-800 transition !border-1 !border-gray-100 rounded-md"
        >
          Clear filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-h-[200vh] overflow-auto !p-1">
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
