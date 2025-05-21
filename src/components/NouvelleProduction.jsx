import { useState, useEffect } from "react";
import { Archive, PlusCircle, X } from "lucide-react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // adapte si chemin différent
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import AnimatedLoader from "./AnimatedLoader";
import DialogProduction from "./DialogProduction";

const NouvelleProduction = () => {
  const [query, setQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [action, setAction] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (!selectedIngredient || !ingredientPrincipalUnite) {
      toast.error("Veuillez choisir l'ingrédient principal et son unité.");
      return;
    }

    if (ingredientsSecondaires.length === 0) {
      toast.error("Veuillez ajouter au moins un ingrédient secondaire.");
      return;
    }

    if (utilitairesChoisis.length === 0) {
      toast.error("Veuillez ajouter au moins un utilitaire.");
      return;
    }

    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, ""); // ex: 20250515

    // Étape 1 : récupérer les modèles existants du jour
    const snapshot = await getDocs(collection(db, "modeleproduction"));
    const countForToday = snapshot.docs.filter((doc) => {
      const data = doc.data();
      return (
        data.dateCreation?.toDate().toISOString().split("T")[0] ===
        today.toISOString().split("T")[0]
      );
    }).length;

    // Étape 2 : construire l'ID personnalisé
    const numero = String(countForToday + 1).padStart(3, "0");
    const idPersonnalise = `PROD-${dateStr}-${numero}`;

    try {
      await setDoc(doc(db, "modeleproduction", idPersonnalise), {
        id: idPersonnalise,
        nom: nomProduction,
        dateCreation: Timestamp.now(),
        ingredientPrincipal: {
          nom: selectedIngredient.nom,
          unite: ingredientPrincipalUnite,
        },
        ingredientsSecondaires: ingredientsSecondaires,
        utilitaires: utilitairesChoisis,
      });
      toast.success(`Production ${idPersonnalise} enregistrée avec succès !`);
      // Réinitialisation du formulaire si souhaité
      setSelectedIngredient(null);
      setIngredientPrincipalUnite("");
      setIngredientsSecondaires([]);
      setUtilitairesChoisis([]);
      setShowCreateDialog(false);
      setLoader(false);
    } catch (error) {
      console.error("Erreur Firestore :", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      setShowCreateDialog(false);
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <AnimatedLoader fullText="Les Sandwichs du Docteur" />}
      <div>
        {/* Grille des cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Production existante */}
          <div
            onClick={() => setAction("use")}
            className="cursor-pointer p-6 rounded-xl bg-doctor-orange text-white hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-2">
              <Archive className="w-8 h-8" />
              <h3 className="text-xl font-bold">Production existante</h3>
            </div>
            <p className="text-sm text-white/90">
              Lancer une production à partir d’un modèle déjà enregistré.
            </p>
          </div>

          {/* Créer production */}
          <div
            onClick={() => setAction("create")}
            className="cursor-pointer p-6 rounded-xl bg-green-500 text-white hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-2">
              <PlusCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Créer Production</h3>
            </div>
            <p className="text-sm text-white/90">
              Démarrer une nouvelle production personnalisée.
            </p>
          </div>
        </div>
        {/* Dialog : Créer production */}
        <DialogProduction
          action={action}
          killAction={(e) => {
            setAction(null);
          }}
        />
      </div>
    </>
  );
};

export default NouvelleProduction;
