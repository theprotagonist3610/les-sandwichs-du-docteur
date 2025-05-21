import { useState } from "react";
import {
  Home,
  Boxes,
  Truck,
  Factory,
  ShoppingCart,
  Users,
  Utensils,
  Bot,
} from "lucide-react";
import { AccueilContent } from "./AccueilContent";
import { ClientsContent } from "./ClientsContent";
import { LivraisonContent } from "./LivraisonContent";
import { MenusContent } from "./MenusContent";
import { ProductionContent } from "./ProductionContent";
import { StocksContent } from "./StocksContent";
import { VentesContent } from "./VentesContent";
import { GestionIA } from "./GestionIA";
import SwitchMenuDuJour from "./SwitchMenuDuJour";
export const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("accueil");
  // Contenu des différentes sections
  const tabContents = {
    accueil: <AccueilContent />,
    stocks: <StocksContent />,
    livraisons: <LivraisonContent />,
    production: <ProductionContent />,
    ventes: <VentesContent />,
    clients: <ClientsContent />,
    menus: <MenusContent />,
    ia: <GestionIA />,
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doctor-cream">
      {/* Sidebar/Navigation - Vertical sur desktop, horizontal sur mobile */}
      <nav className="bg-doctor-deeporange text-white md:w-64 md:h-screen md:sticky md:top-20 md:self-start">
        <div className="flex flex-row md:flex-col p-2 md:p-4 space-y-0 md:space-y-2 space-x-2 md:space-x-0 overflow-x-auto md:overflow-x-visible">
          {[
            {
              id: "accueil",
              label: "Accueil",
              icon: <Home className="w-5 h-5" />,
            },
            {
              id: "stocks",
              label: "Stocks",
              icon: <Boxes className="w-5 h-5" />,
            },
            {
              id: "livraisons",
              label: "Livraisons",
              icon: <Truck className="w-5 h-5" />,
            },
            {
              id: "production",
              label: "Production",
              icon: <Factory className="w-5 h-5" />,
            },
            {
              id: "ventes",
              label: "Ventes",
              icon: <ShoppingCart className="w-5 h-5" />,
            },
            {
              id: "clients",
              label: "Clients",
              icon: <Users className="w-5 h-5" />,
            },
            {
              id: "menus",
              label: "Menus",
              icon: <Utensils className="w-5 h-5" />,
            },
            {
              id: "ia",
              label: "I.A",
              icon: <Bot className="w-5 h-5" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "bg-doctor-red text-white"
                    : "hover:bg-doctor-orange/80 hover:text-white"
                }`}>
              {tab.icon}
              <span className="ml-2 text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab != "menus" ? (
            <div className="grid grid-cols-3">
              <h1 className="text-2xl md:text-3xl font-bold text-doctor-deeporange mb-6">
                {getTabTitle(activeTab)}
              </h1>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              <h1 className="text-2xl md:text-3xl font-bold text-doctor-deeporange mb-6">
                {getTabTitle(activeTab)}
              </h1>
              <div></div>
              <SwitchMenuDuJour />
            </div>
          )}
          <div className="border-t border-doctor-orange/20 pt-4">
            {
              <AccueilContent
                show={activeTab == "accueil" ? "" : "hidden"}></AccueilContent>
            }
            {
              <StocksContent
                show={activeTab == "stocks" ? "" : "hidden"}></StocksContent>
            }
            {
              <LivraisonContent
                show={
                  activeTab == "livraisons" ? "" : "hidden"
                }></LivraisonContent>
            }
            {
              <ProductionContent
                show={
                  activeTab == "production" ? "" : "hidden"
                }></ProductionContent>
            }
            {
              <VentesContent
                show={activeTab == "ventes" ? "" : "hidden"}></VentesContent>
            }
            {
              <ClientsContent
                show={activeTab == "clients" ? "" : "hidden"}></ClientsContent>
            }
            {
              <MenusContent
                show={activeTab == "menus" ? "" : "hidden"}></MenusContent>
            }
            {<GestionIA show={activeTab == "ia" ? "" : "hidden"}></GestionIA>}
          </div>
        </div>
      </main>
    </div>
  );
};

// Fonction utilitaire pour les titres
const getTabTitle = (tabId) => {
  const titles = {
    accueil: "Tableau de Bord",
    stocks: "Gestion des Stocks",
    livraisons: "Gestion des Livraisons",
    production: "Gestion de la Production",
    ventes: "Gestion des Ventes",
    clients: "Gestion des Clients",
    menus: "Gestion des Menus",
    ia: "Gestion IA",
  };
  return titles[tabId] || "";
};

// Composant de carte statistique réutilisable
