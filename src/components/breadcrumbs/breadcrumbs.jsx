import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";

export default function BreadcrumbsComponent({ location }) {
  const parts = location.split("/");
  const lastPart = decodeURIComponent(parts[parts.length - 1]);

  const locationToShow = lastPart
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className="!text-white !font-semibold !text-2xl !font-['Oswald'] !mb-6 !mt-8"
    >
      <Link
        to="/"
        className="transition-colors duration-300 hover:text-green-400"
      >
        Home
      </Link>
      <Link
        to={`${location}`}
        className="text-gray-300 transition-colors duration-300 hover:text-green-400"
      >
        {locationToShow}
      </Link>
    </Breadcrumbs>
  );
}
