import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex gap-20">
      <h1>Header</h1>
      <div className="flex gap-10">
        <Link to={"/"}>Home</Link>
        <Link to={"/favorites"}>Favorites</Link>
      </div>
    </div>
  );
}
