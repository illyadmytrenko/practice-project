import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import ModalSearch from "../components/modal-search/modal-search";
import { useModalSearch } from "../context/modal-search-context";

export default function MainLayout() {
  const { isModalWindowOpen, setIsModalWindowOpen } = useModalSearch();

  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-black relative overflow-hidden"
        onClick={() => setIsModalWindowOpen(false)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,_rgba(34,197,94,0.4),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_rgba(34,197,94,0.4),_transparent_50%)]"></div>
        <Header />
        <div
          className={`${
            isModalWindowOpen ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <ModalSearch />
    </>
  );
}
