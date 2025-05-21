import { useEffect, useState } from "react";
import NouvelleProduction from "./NouvelleProduction";
import ProductionsEnCours from "./ProductionEnCours";
import ProductionsProgrammees from "./ProductionProgrammees";
import ProductionsTerminees from "./ProductionsTerminees";
const tabs = [
  "Nouvelle Production",
  "Productions en Cours",
  "Productions Programmées",
  "Productions Terminées",
];

const Production = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("productionTab") || tabs[0];
  });

  useEffect(() => {
    localStorage.setItem("productionTab", activeTab);
  }, [activeTab]);

  const renderSection = () => {
    switch (activeTab) {
      case "Nouvelle Production":
        return <NouvelleProduction />;
      case "Productions en Cours":
        return <ProductionsEnCours />;
      case "Productions Programmées":
        return <ProductionsProgrammees />;
      case "Productions Terminées":
        return <ProductionsTerminees />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* Select mobile */}
      <div className="sm:hidden mb-4 relative">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded border border-doctor-deeporange bg-white text-doctor-deeporange font-semibold shadow-sm focus:ring-2 focus:ring-doctor-orange focus:outline-none transition">
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-doctor-deeporange">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Onglets desktop */}
      <div className="hidden sm:flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-semibold text-sm transition
              ${
                activeTab === tab
                  ? "bg-doctor-deeporange text-white"
                  : "bg-doctor-cream text-doctor-red hover:bg-doctor-orange hover:text-white"
              }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="bg-white border rounded-lg shadow p-4 min-h-[200px]">
        {renderSection()}
      </div>
    </div>
  );
};

export default Production;
