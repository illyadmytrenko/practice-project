import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const { id } = useParams();

  const [movie, setMovie] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке фильмов:", error);
      });
  }, [id]);

  return (
    <div>
      <div>
        <img
          src={movie.poster}
          alt={movie.title}
          className="max-w-[300px] h-full bg-cover rounded-xl"
        />
      </div>
    </div>
  );
}
