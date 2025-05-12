import { useModalSearch } from "../../context/modal-search-context";
import Logo from "../logo/logo";
import { useModalAccount } from "../../context/modal-account-context";
import CustomInput from "../custom-input/custom-input";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const {
    isModalWindowSearchOpen,
    setIsModalWindowSearchOpen,
    setSearchString,
  } = useModalSearch();
  const { setIsModalWindowAccountOpen } = useModalAccount();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    user = {};
  }

  const openModalWindowAccount = (e) => {
    e.stopPropagation();
    if (!token) {
      setIsModalWindowAccountOpen(true);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="!p-5 sm:!p-8 text-white z-10 flex flex-col md:flex-row gap-5 md:gap-[60px] flex-wrap justify-between items-center relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-black after:to-green-500">
      <Logo />
      <nav
        className={`!flex flex-wrap justify-center gap-10 text-2xl font-semibold transition duration-300 ${
          isModalWindowSearchOpen ? "blur-sm pointer-events-none" : ""
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
        </Link>{" "}
        <Link
          to={"/movies-list"}
          className="transition-colors duration-300 hover:text-green-400"
        >
          Movies List
        </Link>

        <Link
          to={"/privacy"}
          className="transition-colors duration-300 hover:text-green-400"
        >
          Privacy
        </Link>
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
            const value = e.target.value;
            setSearchString(value);
            setIsModalWindowSearchOpen(value.trim() !== "");
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-[160px]"
        />
        <button
          type="button"
          onClick={(e) => openModalWindowAccount(e)}
          className={`!flex gap-10 text-2xl font-semibold transition duration-300 ${
            isModalWindowSearchOpen ? "blur-sm pointer-events-none" : ""
          }`}
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
