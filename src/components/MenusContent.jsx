import { useState, useEffect } from "react";
import Menus from "./Menus";
import Ingredients from "./Ingredients";
import SuperMenus from "./SuperMenus";
export const MenusContent = ({ show }) => {
  const [onglets, setOnglets] = useState("Super Menus");

  const tabs = ["Super Menus", "Menus", "Ingredients"];

  return (
    <div className={`${show}`}>
      {/* Onglets */}
      {/* Onglets : version responsive */}
      <div className="mb-4">
        {/* Select visible uniquement sur mobile */}
        <div className="sm:hidden relative">
          <select
            value={onglets}
            onChange={(e) => setOnglets(e.target.value)}
            className="w-full appearance-none px-4 py-2 pr-10 rounded border border-doctor-deeporange bg-white text-doctor-deeporange font-semibold shadow-sm focus:ring-2 focus:ring-doctor-orange focus:outline-none transition">
            {tabs.map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>

          {/* Icône flèche à droite */}
          <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-doctor-deeporange">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Onglets visibles uniquement à partir de sm */}
        <div className="hidden sm:block bg-doctor-deeporange overflow-x-auto whitespace-nowrap rounded">
          <div className="flex min-w-[480px] sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setOnglets(tab)}
                className={`flex-1 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200
            ${
              onglets === tab
                ? "bg-white text-doctor-deeporange"
                : "text-white hover:bg-doctor-orange"
            }
            border-r last:border-r-0 border-white`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu dynamique selon l'onglet actif */}
      <div className="bg-white p-4 rounded">
        <div className={`${onglets === "Super Menus" ? "" : "hidden"}`}>
          {/* Ton contenu Super Menus ici */}
          <SuperMenus></SuperMenus>
        </div>
        <div className={`${onglets === "Menus" ? "" : "hidden"}`}>
          {/* Ton contenu Menus ici */}
          <Menus></Menus>
        </div>
        <div className={`${onglets === "Ingredients" ? "" : "hidden"}`}>
          {/* Ton contenu Ingrédients ici */}
          <Ingredients></Ingredients>
        </div>
      </div>
    </div>
  );
};
