import React from "react";
import Navbar from "../components/Navbar";

const CommandesAdmin = () => {
  return (
    <div className="min-h-screen bg-doctor-cream text-doctor-red">
      {/* Navbar en haut */}
      <Navbar />
      {/* Contenu de la page */}
      <main className="text-center py-20"></main>
    </div>
  );
};

export default CommandesAdmin;
