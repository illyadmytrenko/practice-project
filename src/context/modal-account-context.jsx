import { createContext, useContext, useState } from "react";

const ModalAccountContext = createContext(null);

export function ModalAccountProvider({ children }) {
  const [isModalWindowAccountOpen, setIsModalWindowAccountOpen] =
    useState(false);

  return (
    <ModalAccountContext.Provider
      value={{
        isModalWindowAccountOpen,
        setIsModalWindowAccountOpen,
      }}
    >
      {children}
    </ModalAccountContext.Provider>
  );
}

export function useModalAccount() {
  const context = useContext(ModalAccountContext);
  if (!context)
    throw new Error("useModalAccount must be used inside MoviesProvider");
  return context;
}
