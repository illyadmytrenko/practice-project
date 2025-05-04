import { Link } from "react-router-dom";
import { useModalSearch } from "../../context/modal-search-context";
import Logo from "../logo/logo";

export default function Header() {
  const { isModalWindowOpen, setIsModalWindowOpen, setSearchString } =
    useModalSearch();

  return (
    <div className="relative !p-5 sm:!p-8 text-white z-10 flex flex-col min-[550px]:flex-row gap-5 min-[550px]:gap-[60px] md:gap-20 justify-between items-center after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-black after:to-green-500">
    <div className="!p-5 sm:!p-8 text-white z-10 flex flex-col min-[650px]:flex-row gap-5 min-[650px]:gap-[60px] md:gap-20 justify-between items-center">
      <Logo />
      <nav
        className={`!flex gap-10 text-2xl font-semibold transition duration-300 ${
          isModalWindowOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <Link
          to={"/"}
          className="transition-colors duration-300 hover:text-green-400"
        >
          Home
        </Link>
        <Link
          to={"/favorites"}
          className="transition-colors duration-300 hover:text-green-400"
        >
          Favorites
        </Link>
        <Link
          to={"/schedule"}
          className="transition-colors duration-300 hover:text-green-400"
        >
          Schedule
        </Link>
      </nav>

      <div className="relative z-20">
        <input
          type="text"
          placeholder="Search"
          className="!p-2 rounded-md bg-white text-black w-[160px] !border-1 focus:!border-2 border-black"
          onChange={(e) => {
            const value = e.target.value;
            setSearchString(value);
            setIsModalWindowOpen(value.trim() !== "");
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
