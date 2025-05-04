import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div>
      <Link to="/" className="text-xl font-bold tracking-wide uppercase">
        <span className="text-white">Movie</span>
        <span className="text-green-500">Time</span>
      </Link>
    </div>
  );
}
