import { useParams } from "react-router-dom";

export default function MoviePage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Movie Page</h1>
      <p>Movie ID: {id}</p>
    </div>
  );
}
