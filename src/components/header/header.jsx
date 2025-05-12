import { useModalSearch } from "../../context/modal-search-context";
import Logo from "../logo/logo";
import { useModalAccount } from "../../context/modal-account-context";
import CustomInput from "../custom-input/custom-input";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function Header() {
  const {
    isModalWindowSearchOpen,
    setIsModalWindowSearchOpen,
    searchString,
    setSearchString,
  } = useModalSearch();
  const { setIsModalWindowAccountOpen } = useModalAccount();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return {};
    }
  }, []);

  const isBlurred = isModalWindowSearchOpen
    ? "blur-sm pointer-events-none"
    : "";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/favorites", label: "Favorites" },
    { to: "/schedule", label: "Schedule" },
    { to: "/movies-list", label: "Movies List" },
    { to: "/privacy", label: "Privacy" },
  ];

  const openModalWindowAccount = (e) => {
    e.stopPropagation();
    token ? navigate("/profile") : setIsModalWindowAccountOpen(true);
  };

  return (
    <div className="!p-5 sm:!p-8 text-white z-10 flex flex-col md:flex-row gap-x-5 gap-y-5 md:gap-x-[40px] flex-wrap justify-between items-center relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-black after:to-green-500">
      <Logo />
      <nav
        className={`!flex flex-wrap justify-center gap-10 text-2xl font-semibold transition duration-300 ${isBlurred}`}
      >
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="transition-colors duration-300 hover:text-green-400"
          >
            {label}
          </Link>
        ))}
        {user.role === "admin" && (
          <Link
            to="/admin"
            className="transition-colors duration-300 hover:text-green-400"
          >
            Admin
          </Link>
        )}
      </nav>

      <div className="relative z-20 flex gap-5 items-center">
        <CustomInput
          type="text"
          placeholder="Search"
          onChange={(e) => {
            const value = e.target.value.trim();
            setSearchString(value);
            setIsModalWindowSearchOpen(!!value);
          }}
          value={searchString}
          onClick={(e) => e.stopPropagation()}
          className="w-[160px]"
        />
        <button
          type="button"
          onClick={openModalWindowAccount}
          className={`!flex gap-10 text-2xl font-semibold transition duration-300 ${isBlurred}`}
        >
          <img
            src="./assets/icons/account.png"
            className="w-10 h-10"
            alt="account icon"
          />
        </button>
      </div>
    </div>
  );
}
