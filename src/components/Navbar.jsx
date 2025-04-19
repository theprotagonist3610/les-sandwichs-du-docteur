// src/components/Navbar.jsx
import React from "react";
import logo from "/Les sandwichs.png"; // remplace par le chemin réel si différent

const Navbar = () => {
  return (
    <nav className="h-20 bg-doctor-cream flex items-center justify-between px-6 shadow-md">
      {/* Logo à gauche */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-[100px] h-[100px] object-contain" />
        {/* <img src={logo} alt="Logo" className="h-12 w-auto" /> */}
        <span className="text-doctor-red text-xl font-bold">Les Sandwichs du Docteur</span>
      </div>

      {/* Onglets de navigation */}
      <div className="flex items-center space-x-6">
        <a href="#" className="text-doctor-red font-medium hover:text-doctor-deeporange">Accueil</a>
        <a href="#" className="text-doctor-red font-medium hover:text-doctor-deeporange">Commandes</a>
        <a href="#" className="text-doctor-red font-medium hover:text-doctor-deeporange">Administration</a>
      </div>

      {/* Boutons à droite */}
      <div className="flex items-center space-x-4">
        <button className="border border-doctor-red text-doctor-red px-4 py-1 rounded hover:bg-doctor-orange hover:text-white">
          S'inscrire
        </button>
        <button className="bg-doctor-red text-white px-4 py-1 rounded hover:bg-doctor-deeporange">
          Se connecter
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
