// src/PanierContext.js
import { createContext, useContext, useState } from "react";

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [commandes, setCommandes] = useState([]); // tableau de commandes
  const ajouterCommande = (item) => {
    setCommandes((prev) => [...prev, item]);
  };

  return (
    <PanierContext.Provider value={{ commandes, ajouterCommande }}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => useContext(PanierContext);
