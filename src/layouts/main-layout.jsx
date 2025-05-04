import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import ModalSearch from "../components/modal-search/modal-search";
import { useModalSearch } from "../context/modal-search-context";
import BreadcrumbsComponent from "../components/breadcrumbs/breadcrumbs";

export default function MainLayout() {
  const { isModalWindowOpen, setIsModalWindowOpen } = useModalSearch();

  const location = useLocation();

  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-black relative overflow-hidden"
        onClick={() => setIsModalWindowOpen(false)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,_rgba(34,197,94,0.4),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_rgba(34,197,94,0.4),_transparent_50%)]"></div>
        <div className="z-50">
          <Header />
          <div
            className={`${
              isModalWindowOpen ? "blur-sm pointer-events-none" : ""
            }`}
          >
            <main
              className={`flex-grow ${
                location.pathname !== "/" ? "!mx-20" : ""
              }`}
            >
              {location.pathname !== "/" && (
                <BreadcrumbsComponent location={location.pathname} />
              )}
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
      <ModalSearch />
    </>
  );
}
