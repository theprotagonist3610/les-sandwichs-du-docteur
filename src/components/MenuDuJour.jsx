import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { usePanier } from "../PanierContext";
import { useUser } from "../UserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export const MenuDuJour = () => {
  const navigate = useNavigate();
  const { utilisateur } = useUser();
  const [menu, setMenu] = useState(null);
  const [bgColor, setBgColor] = useState("bg-doctor-cream");
  const [titre, setTitre] = useState("Menu du jour");
  const { ajouterCommande } = usePanier();
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menudujour"));
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setMenu(docData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du menu du jour :", error);
      }
    };

    const setColorAndTitleFromDay = () => {
      const jour = new Date().getDay(); // 0 (dimanche) → 6 (samedi)
      const jours = [
        "dimanche",
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
      ];
      const couleurs = [
        "bg-red-100", // dimanche
        "bg-doctor-cream", // lundi
        "bg-orange-100", // mardi
        "bg-yellow-100", // mercredi
        "bg-green-100", // jeudi
        "bg-blue-100", // vendredi
        "bg-purple-100", // samedi
      ];
      const titres = [
        "La surprise du dimanche",
        "Le classique du lundi",
        "Le sandwich du mardi",
        "Le délice du mercredi",
        "L’inspiration du jeudi",
        "La folie du vendredi",
        "La touche du samedi",
      ];

      setBgColor(couleurs[jour]);
      setTitre(titres[jour]);
    };

    fetchMenu();
    setColorAndTitleFromDay();
  }, []);

  if (!menu) return <p>Chargement du menu du jour...</p>;

  return (
    <div className="flex flex-col items-center px-4">
      {/* En-tête dynamique */}
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[#a41624] to-[#d9571d] bg-clip-text">
          🥪 {titre}
        </h2>
        <p className="text-sm text-gray-600">
          Découvrez notre suggestion du chef, fraîchement préparée.
        </p>
      </div>

      {/* Carte dynamique */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.01 }}
        className={`${bgColor} border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-6 mb-6 w-full max-w-4xl flex flex-col lg:flex-row items-stretch gap-6`}>
        {/* Image */}
        <div className="w-full lg:w-1/3">
          <img
            src={menu.image}
            alt={menu.nom}
            className="rounded-xl w-full h-80 object-cover"
          />
        </div>

        {/* Fiche technique */}
        <div className="w-full lg:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-doctor-deeporange text-2xl font-bold">
                {menu.prix} FCFA
              </span>
              <span className="text-sm text-doctor-red font-semibold">
                {menu.calories} kcal
              </span>
            </div>

            <p className="text-sm italic text-gray-700 mb-4">
              "{menu.message || "Un plaisir sain pour votre journée !"}"
            </p>

            <div className="mb-4">
              <h3 className="text-doctor-red font-semibold mb-1">
                Ingrédients :
              </h3>
              <div className="flex flex-wrap gap-2">
                {menu.ingredients?.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-sm rounded-full bg-doctor-orange text-white">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-800">{menu.description}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                if (!utilisateur) {
                  toast.error("Veuillez vous connecter pour commander.");
                  navigate("/connexion");
                  return;
                }
                ajouterCommande(menu);
                toast.success(`"${menu.nom}" ajouté au panier 🍽️`);
              }}
              className="bg-doctor-red text-white font-bold py-2 px-6 rounded-xl hover:bg-red-800 transition w-fit">
              Ajouter au Panier
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
