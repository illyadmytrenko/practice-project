import { createContext, useContext, useState } from "react";

const ModalSearchContext = createContext(null);

export function ModalSearchProvider({ children }) {
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [searchString, setSearchString] = useState("");

  return (
    <ModalSearchContext.Provider
      value={{
        isModalWindowOpen,
        setIsModalWindowOpen,
        searchString,
        setSearchString,
      }}
    >
      {children}
    </ModalSearchContext.Provider>
  );
}

export function useModalSearch() {
  const context = useContext(ModalSearchContext);
  if (!context)
    throw new Error("useModalSearch must be used inside MoviesProvider");
  return context;
}
