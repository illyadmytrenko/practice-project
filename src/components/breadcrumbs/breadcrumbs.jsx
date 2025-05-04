import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function BreadcrumbsComponent({ location }) {
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
        to={`/${location}`}
        className="text-gray-300 transition-colors duration-300 hover:text-green-400"
      >
        {location.charAt(1).toUpperCase() + location.slice(2)}
      </Link>
    </Breadcrumbs>
  );
}
