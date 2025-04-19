import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-doctor-cream text-doctor-red">
      {/* Navbar en haut */}
      <Navbar />

      {/* Contenu de la page */}
      <main className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue chez Les Sandwichs du Docteur
        </h1>
        <p className="text-lg mb-6">
          Des sandwichs généreux, préparés avec amour et livrés chez vous.
        </p>
        <a
          href="#"
          className="bg-doctor-orange hover:bg-doctor-deeporange hover:text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Commander maintenant
        </a>
      </main>
    </div>
  );
};

export default HomePage;
