import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMovies } from "../../context/movies-context";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const { movies } = useMovies();
  const navigate = useNavigate();

  const recommendedMovies = movies
      .filter((m) => m.id !== id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

  const goToMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
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
      <div className="px-6 text-white flex flex-col gap-6 !pb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Постер и кнопка */}
          <div className="w-[300px] flex flex-col items-center gap-6">
            <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-lg"
            />
            <a
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-600/50 hover:bg-green-800/70 text-white text-xl font-semibold text-center transition rounded
               px-6 min-h-[40px] box-border flex items-center justify-center gap-2 "
            >
              <span className="text-2xl">►</span> Дивитись трейлер
            </a>
          </div>

          {/* Інформація */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <div className="grid grid-cols-2 gap-y-3 text-lg mt-4">
              <div className="text-gray-300">Вікові обмеження:</div>
              <div>{movie.ageRestriction} (Попередньо)</div>

              <div className="text-gray-300">Рік:</div>
              <div>{movie.year}</div>

              <div className="text-gray-300">Оригінальна назва:</div>
              <div>{movie.originalTitle}</div>

              <div className="text-gray-300">Режисер:</div>
              <div>{movie.director}</div>

              <div className="text-gray-300">Мова:</div>
              <div>українська мова</div>

              <div className="text-gray-300">Жанр:</div>
              <div>{movie.genre?.join(", ")}</div>

              <div className="text-gray-300">Тривалість:</div>
              <div>{Math.floor(movie.duration / 60)}:{movie.duration % 60}</div>

              <div className="text-gray-300">Виробництво:</div>
              <div>{Array.isArray(movie.country) ? movie.country.join(", ") : movie.country}</div>

              <div className="text-gray-300">Студія:</div>
              <div>{movie.studio}</div>

              <div className="text-gray-300">Продюсер:</div>
              <div>{movie.producer}</div>

              <div className="text-gray-300">У головних ролях:</div>
              <div>{movie.cast?.join(", ")}</div>
              <div className="text-gray-300">Рейтинг глядачів:</div>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <span>{movie.rating}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-green-600" viewBox="0 0 24 24">
                  <path d="M12 2l2.7 6.5L22 9.2l-5 4.8 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.8 7.3-0.7L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Опис */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Опис</h2>
          <p className="text-lg leading-relaxed">{movie.description}</p>
        </div>

        {/* Дивіться також */}
        <div className="w-full mx-auto mt-24 flex flex-col gap-6">
          <h2 className="text-2xl font-bold">Дивіться також:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {recommendedMovies.map((recMovie) => (
                <div
                    key={recMovie.id}
                    onClick={() => goToMovie(recMovie.id)}
                    className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform p-2"
                >
                  <img
                      src={recMovie.poster}
                      alt={recMovie.title}
                      className="w-full h-[400px] object-cover rounded-xl shadow-md"
                  />
                  <p className="mt-2 text-center text-lg font-semibold text-white">
                    {recMovie.title}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}
