import { useMemo, useState } from "react";
import { useMovies } from "../../context/movies-context";
import MoviePoster from "../../components/movie-poster/movie-poster";
import { getNextDays } from "../../functions/get-next-days";
import { toMinutes } from "../../functions/to-minutes";
import { navigateToBuyTicket } from "../../functions/navigate-to-buy-ticket";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../../context/schedule-context";

export default function Schedule() {
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const { movies } = useMovies();
  const { schedule } = useSchedule();

  const navigate = useNavigate();

  const currentMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  const getUpcomingSessions = useMemo(() => {
    return (movieId) =>
      schedule
        .flatMap((hall) =>
          hall.schedule
            .filter(
              (session) =>
                session.movieId === movieId &&
                session.dates.includes(selectedDate) &&
                (selectedDate !== todayDate ||
                  toMinutes(session.time) > currentMinutes)
            )
            .map((session) => ({ ...session, hall: hall.hall }))
        )
        .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  }, [schedule, selectedDate, todayDate, currentMinutes]);

  const sortedMovies = useMemo(() => {
    return movies
      .map((movie) => {
        const sessions = getUpcomingSessions(movie.id);
        return { movie, sessions };
      })
      .filter((entry) => entry.sessions.length > 0)
      .sort(
        (a, b) => toMinutes(a.sessions[0].time) - toMinutes(b.sessions[0].time)
      );
  }, [movies, getUpcomingSessions]);

  return (
    <div className="text-white !px-3 sm:!px-6 !pb-12 max-h-[200vh] overflow-auto">
      <div className="flex gap-3 !mb-6 overflow-x-auto">
        {getNextDays().map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`!px-4 !py-2 rounded ${
              selectedDate === date
                ? "bg-green-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {new Date(date).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {sortedMovies.map(({ movie, sessions }) => (
          <div key={movie.id} className="flex flex-col sm:flex-row gap-5">
            <MoviePoster
              movie={movie}
              className="!h-[300px] md:!h-[400px]"
              classNameImg="!h-[300px] md:!h-[400px]"
            />
            <div className="flex-[1_1_30%] flex flex-col gap-3">
              <h3 className="text-2xl font-semibold">{movie.title}</h3>
              <div className="flex flex-wrap gap-3">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 hover:bg-zinc-700 !p-3 rounded shadow text-sm cursor-pointer w-fit"
                    onClick={() =>
                      navigateToBuyTicket(
                        navigate,
                        movie.id,
                        session.hall,
                        selectedDate,
                        session.time,
                        session.price,
                        movie.duration
                      )
                    }
                  >
                    <p className="font-medium">{session.time}</p>
                    <p className="text-gray-400 text-xs">Hall {session.hall}</p>
                    <p className="text-green-400">{session.price} ₴</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
