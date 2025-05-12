import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMovies } from "../../context/movies-context";
import Select from "react-select";
import { selectStyles } from "../../constants/select-styles";
import { getNextDays } from "../../functions/get-next-days";
import { toMinutes } from "../../functions/to-minutes";
import { navigateToBuyTicket } from "../../functions/navigate-to-buy-ticket";
import { useSchedule } from "../../context/schedule-context";
import MoviePosterWithoutInfo from "../../components/movie-poster-without-info/movie-poster-without-info";
import { goToMovie } from "../../functions/go-to-movie";

export default function MoviePage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const { movies } = useMovies();
  const { schedule } = useSchedule();

  const navigate = useNavigate();

  const recommendedMovies = useMemo(() => {
    if (!movie) return;

    const movieGenres = movie.genre.map((g) => g.toLowerCase());
    return movies
      .filter((m) => {
        if (m.id === movie.id) return false;
        const mGenres = m.genre.map((g) => g.toLowerCase());
        return mGenres.some((g) => movieGenres.includes(g));
      })
      .slice(0, 4);
  }, [movie, movies]);

  console.log(recommendedMovies);

  const options = getNextDays().map((date) => ({
    value: date,
    label: new Date(date).toLocaleDateString("uk-UA", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }),
  }));

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const filteredSessions = useMemo(() => {
    if (!movie) return [];
    return schedule.flatMap((hall) =>
      hall.schedule
        .filter(
          (session) =>
            session.dates.includes(selectedDate) &&
            session.movieId === movie.id &&
            (selectedDate !== todayDate ||
              toMinutes(session.time) > currentMinutes)
        )
        .map((session) => ({
          ...session,
          hallNumber: hall.hall,
        }))
    );
  }, [schedule, selectedDate, todayDate, currentMinutes, movie]);

  const handleDateChange = (option) => {
    setSelectedDate(option?.value || "");
  };

  useEffect(() => {
    axios
      // .get(`http://localhost:5050/api/movies/${id}`)
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке фильмов:", error);
      });
  }, [id]);

  if (!movie) {
    return (
      <div className="text-white text-center py-10 text-xl">
        Завантаження фільму...
      </div>
    );
  }

  return (
    <div className="text-white !px-3 !sm:px-6 !pb-12 flex flex-col gap-6">
      <div className="flex flex-col-reverse lg:flex-row justify-between gap-12">
        <div className="max-w-6xl !mx-auto flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[300px] flex flex-col items-center gap-6">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-xl shadow-lg object-cover"
            />
            <a
              href={movie.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-600/50 hover:bg-green-800/70 text-white text-xl font-semibold text-center transition rounded
                  px-6 min-h-[40px] flex items-center justify-center gap-2"
            >
              <span className="text-2xl">►</span> Watch Trailer
            </a>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="grid grid-cols-2 gap-3 text-lg">
              <p className="text-gray-300">Age Restriction:</p>
              <p>{movie.ageRestriction} (Preliminary)</p>

              <p className="text-gray-300">Year:</p>
              <p>{movie.year}</p>

              <p className="text-gray-300">Director:</p>
              <p>{movie.director}</p>

              <p className="text-gray-300">Language:</p>
              <p>Ukrainian</p>

              <p className="text-gray-300">Genre:</p>
              <p>{movie.genre?.join(", ")}</p>

              <p className="text-gray-300">Duration:</p>
              <p>
                {Math.floor(movie.duration / 60)}:{movie.duration % 60}
              </p>

              <p className="text-gray-300">Country:</p>
              <p>
                {Array.isArray(movie.country)
                  ? movie.country.join(", ")
                  : movie.country}
              </p>

              <p className="text-gray-300">Studio:</p>
              <p>{movie.studio}</p>

              <p className="text-gray-300">Producer:</p>
              <p>{movie.producer}</p>

              <p className="text-gray-300">Cast:</p>
              <p>{movie.cast?.join(", ")}</p>

              <p className="text-gray-300">Viewer Rating:</p>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <span>{movie.rating}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-green-600"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l2.7 6.5L22 9.2l-5 4.8 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.8 7.3-0.7L12 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="!p-4 border border-green-700 rounded-md bg-zinc-900 h-fit flex-1 min-w-[200px] max-w-[300px]">
          <Select
            onChange={handleDateChange}
            value={{
              value: selectedDate,
              label: new Date(selectedDate).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              }),
            }}
            options={options}
            styles={selectStyles}
            className="text-xl !mb-6"
          />
          <div className="flex flex-wrap gap-3">
            {filteredSessions.map((session, index) => (
              <div
                key={index}
                className="bg-zinc-800 hover:bg-zinc-700 !p-3 rounded shadow text-sm cursor-pointer w-fit"
                onClick={() =>
                  navigateToBuyTicket(
                    navigate,
                    movie.id,
                    session.hallNumber,
                    selectedDate,
                    session.time,
                    session.price,
                    movie.duration
                  )
                }
              >
                <p className="font-medium">{session.time}</p>
                <p className="text-gray-400 text-xs">
                  Hall {session.hallNumber}
                </p>
                <p className="text-green-400">{session.price} ₴</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl">
        <h2 className="text-2xl font-bold !mb-2">Description</h2>
        <p className="text-lg leading-relaxed">{movie.description}</p>
      </div>

      <div className="w-full mx-auto flex flex-col gap-6">
        <h2 className="text-2xl font-bold">You may also like:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {recommendedMovies.map((recMovie) => (
            <MoviePosterWithoutInfo
              movie={recMovie}
              goToMovie={goToMovie}
              key={recMovie.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
