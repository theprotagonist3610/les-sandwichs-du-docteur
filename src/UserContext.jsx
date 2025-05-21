import React, { createContext, useContext, useState } from "react";

// Création du contexte
const UserContext = createContext();

// Hook personnalisé pour y accéder facilement
export const useUser = () => useContext(UserContext);

// Provider global
export const UserProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);

  return (
    <UserContext.Provider value={{ utilisateur, setUtilisateur }}>
      {children}
    </UserContext.Provider>
  );
};
