import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import ModalSearch from "../components/modal-search/modal-search";
import { useModalSearch } from "../context/modal-search-context";
import BreadcrumbsComponent from "../components/breadcrumbs/breadcrumbs";
import { useModalAccount } from "../context/modal-account-context";
import ModalAccount from "../components/modal-account/modal-account";

export default function MainLayout() {
  const { isModalWindowSearchOpen, setIsModalWindowSearchOpen } =
    useModalSearch();
  const { isModalWindowAccountOpen, setIsModalWindowAccountOpen } =
    useModalAccount();

  const location = useLocation();

  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-black relative overflow-hidden"
        onClick={() => {
          setIsModalWindowSearchOpen(false);
          setIsModalWindowAccountOpen(false);
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,_rgba(34,197,94,0.4),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_rgba(34,197,94,0.4),_transparent_50%)]"></div>
        <div
          className={`z-50 ${
            isModalWindowAccountOpen ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <Header />
          <div
            className={`${
              isModalWindowSearchOpen ? "blur-sm pointer-events-none" : ""
            }`}
          >
            <main
              className={`flex-grow min-h-screen ${
                location.pathname !== "/"
                  ? "!mx-6 sm:!mx-8 md:!mx-10 lg:!mx-20"
                  : ""
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
      <ModalAccount />
    </>
  );
}
