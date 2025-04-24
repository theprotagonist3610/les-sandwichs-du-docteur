import React from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
const menuMatin = [
  {
    id: 1,
    title: "Box Viande",
    image: "lsd_farce_viande.png",
    description: "Croissants frais, café ou thé, jus d'orange pressé",
    price: "8.50 €",
  },
  {
    id: 2,
    title: "Box Poisson",
    image: "lsd_farce_poisson.png",
    description: "Œufs brouillés, bacon, toast, fruits frais et café",
    price: "12.90 €",
  },
  {
    id: 3,
    title: "Box Mixte",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
    description: "Pancakes moelleux avec sirop d'érable et fruits de saison",
    price: "10.20 €",
  },
];
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
          className="bg-doctor-orange hover:bg-doctor-deeporange hover:text-white px-6 py-3 rounded-full font-semibold transition">
          Commander maintenant
        </a>
      </main>
      <Menu titre={"Menu Matin"} menuItems={menuMatin} />
      <Menu titre={"Menu Midi"} menuItems={menuMatin} />
      <Menu titre={"Menu Soir"} menuItems={menuMatin} />
    </div>
  );
};

export default HomePage;
