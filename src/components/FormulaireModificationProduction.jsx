// ✅ Formulaire complet de modification d'une production
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "sonner";
import { Button } from "./ui/button";

const FormulaireModificationProduction = ({ prod, onClose }) => {
  const [nom, setNom] = useState(prod.nom);
  const [ingredient, setIngredient] = useState(
    prod.ingredientPrincipal?.nom || ""
  );
  const [unite, setUnite] = useState(prod.ingredientPrincipal?.unite || "");
  const [ingredientsSecondaires, setIngredientsSecondaires] = useState(
    prod.ingredientsSecondaires || []
  );
  const [utilitaires, setUtilitaires] = useState(prod.utilitaires || []);

  const updateProduction = async () => {
    try {
      await updateDoc(doc(db, "modeleproduction", prod.id), {
        nom,
        ingredientPrincipal: { nom: ingredient, unite },
        ingredientsSecondaires,
        utilitaires,
      });
      toast.success("Production modifiée avec succès ✅");
      onClose();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour ❌");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateProduction();
      }}
      className="space-y-6 mt-4">
      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend className="text-sm font-bold text-doctor-red">
          🧂 Ingrédient principal
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="text-sm">Nom</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Unité</label>
            <select
              value={unite}
              onChange={(e) => setUnite(e.target.value)}
              className="w-full px-4 py-2 border rounded-md">
              <option value="">-- Choisir une unité --</option>
              <option value="kg">Kilogramme (kg)</option>
              <option value="l">Litre (L)</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend className="text-sm font-bold text-doctor-red">
          🌿 Ingrédients secondaires
        </legend>
        <div className="space-y-2 mt-2">
          {ingredientsSecondaires.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-doctor-cream p-2 rounded">
              <p className="text-sm text-doctor-red">
                {item.nom} – {item.quantite} {item.unite}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nouveauNom = prompt("Nom de l'ingrédient", item.nom);
                    const nouvelleQuantite = prompt("Quantité", item.quantite);
                    const nouvelleUnite = prompt("Unité", item.unite);
                    if (nouveauNom && nouvelleQuantite && nouvelleUnite) {
                      const updated = [...ingredientsSecondaires];
                      updated[index] = {
                        nom: nouveauNom,
                        quantite: nouvelleQuantite,
                        unite: nouvelleUnite,
                      };
                      setIngredientsSecondaires(updated);
                    }
                  }}
                  className="text-xs text-blue-600 hover:underline">
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setIngredientsSecondaires((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="text-xs text-red-600 hover:underline">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend className="text-sm font-bold text-doctor-red">
          🔧 Utilitaires
        </legend>
        <div className="space-y-2 mt-2">
          {utilitaires.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-doctor-cream p-2 rounded">
              <p className="text-sm text-doctor-red">
                {item.nom} – {item.quantite} {item.unite}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nouveauNom = prompt("Nom de l'utilitaire", item.nom);
                    const nouvelleQuantite = prompt("Quantité", item.quantite);
                    const nouvelleUnite = prompt("Unité", item.unite);
                    if (nouveauNom && nouvelleQuantite && nouvelleUnite) {
                      const updated = [...utilitaires];
                      updated[index] = {
                        nom: nouveauNom,
                        quantite: nouvelleQuantite,
                        unite: nouvelleUnite,
                      };
                      setUtilitaires(updated);
                    }
                  }}
                  className="text-xs text-blue-600 hover:underline">
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setUtilitaires((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-xs text-red-600 hover:underline">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} type="button">
          Annuler
        </Button>
        <Button type="submit" className="bg-doctor-red text-white">
          Valider
        </Button>
      </div>
    </form>
  );
};

export default FormulaireModificationProduction;
