// ✅ Version corrigée de DialogProductionExistante avec un seul Dialog centralisé
import { useEffect, useState } from "react";
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
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { calculIngredients } from "../CalculProduction";

const DialogProduction = ({ action, killAction }) => {
  const [nomProduction, setNomProduction] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsSecondaires, setIngredientsSecondaires] = useState([]);
  const [selectedSecIngredient, setSelectedSecIngredient] = useState(null);
  const [selectedUtilitaire, setSelectedUtilitaire] = useState(null);
  const [queryUtilitaire, setQueryUtilitaire] = useState("");
  const [secQuantite, setSecQuantite] = useState(null);
  const [secUnite, setSecUnite] = useState(null);
  const [showSecDialog, setShowSecDialog] = useState(false);
  const [showUtilitaireDialog, setShowUtilitaireDialog] = useState(false);
  const [utilitaires, setUtilitaires] = useState([]);
  const [utilitairesChoisis, setUtilitairesChoisis] = useState([]);
  const [utilitaireUnite, setUtilitaireUnite] = useState(null);
  const [utilitaireQuantite, setUtilitaireQuantite] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientPrincipalUnite, setIngredientPrincipalUnite] =
    useState(null);
  const [query, setQuery] = useState("");
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
      const dataToSave = {
        id: idPersonnalise,
        nom: nomProduction,
        dateCreation: Timestamp.now(),
        ingredientPrincipal: {
          nom: selectedIngredient.nom,
          unite: ingredientPrincipalUnite,
        },
        ingredientsSecondaires: ingredientsSecondaires,
        utilitaires: utilitairesChoisis,
      };
      console.log(dataToSave);
      await setDoc(doc(db, "modeleproduction", idPersonnalise), dataToSave);
      toast.success(`Production ${idPersonnalise} enregistrée avec succès !`);
      // Réinitialisation du formulaire si souhaité
      setSelectedIngredient(null);
      setIngredientPrincipalUnite("");
      setIngredientsSecondaires([]);
      setUtilitairesChoisis([]);
      killAction();
      setLoader(false);
    } catch (error) {
      console.error("Erreur Firestore :", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      killAction();
      setLoader(false);
    }
  };
  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(db, "ingredients"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIngredients(data);
    };
    fetchIngredients();
  }, []);
  useEffect(() => {
    const fetchUtilitaires = async () => {
      const snapshot = await getDocs(collection(db, "stock"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.type === "matériel");
      setUtilitaires(data);
    };
    fetchUtilitaires();
  }, []);
  const filteredIngredients =
    query === ""
      ? ingredients
      : ingredients.filter((ingredient) =>
          ingredient.nom.toLowerCase().includes(query.toLowerCase())
        );
  return (
    <>
      {action === "create" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => killAction()}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-green-600 mb-4">
              <span>Nouvelle Production :</span>
              <span className="text-md">{`${nomProduction}`}</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/*Identification de la production*/}
              <fieldset className="border border-gray-300 rounded-md p-4">
                <legend className="text-sm font-bold italic text-doctor-red px-2">
                  Nom de la Production
                </legend>
                <input
                  onChange={(e) => setNomProduction(e.target.value)}
                  className="border border-gray-300 rounded-md p-2"
                  name="nomproduction"
                  type="text"
                />
              </fieldset>
              <fieldset className="border border-gray-300 rounded-md p-4">
                <legend className="text-sm font-bold italic text-doctor-red px-2">
                  🧂 Ingrédient principal
                </legend>
                <div className="mt-2">
                  <p className="block text-xs italic mb-2 text-gray-600">
                    Vous êtes sur le point de créer une nouvelle production.
                    Choisissez l'ingrédient principal de votre recette. Dès que
                    cet ingrédient est choisi, tous les ingrédients secondaires
                    sont automatiquement calculés en fonction de la quantité
                    unitaire de l'ingrédient principal. <br />
                    <strong className="text-gray-700">Exemple :</strong> Pour
                    faire du yaourt mangue, l'ingrédient principal, c’est le
                    lait. Tous les renseignements à fournir sont les quantités
                    utiles pour produire <em>1kg</em> de yaourt mangue.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ingrédient principal
                      </label>
                      <Combobox
                        value={selectedIngredient}
                        onChange={setSelectedIngredient}>
                        <div className="relative">
                          <Combobox.Input
                            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-doctor-orange"
                            displayValue={(ingredient) => ingredient?.nom || ""}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Tapez un nom..."
                            required
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                          </Combobox.Button>

                          {filteredIngredients.length > 0 && (
                            <Combobox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                              {filteredIngredients.map((ingredient) => (
                                <Combobox.Option
                                  key={ingredient.id}
                                  value={ingredient}
                                  className={({ active }) =>
                                    `cursor-pointer px-4 py-2 text-sm ${
                                      active
                                        ? "bg-doctor-orange text-white"
                                        : "text-gray-800"
                                    }`
                                  }>
                                  {({ selected }) => (
                                    <div className="flex justify-between items-center">
                                      <span>{ingredient.nom}</span>
                                      {selected && (
                                        <CheckIcon className="w-4 h-4 text-white" />
                                      )}
                                    </div>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Unité de mesure
                      </label>
                      <select
                        onChange={(e) =>
                          setIngredientPrincipalUnite(e.target.value)
                        }
                        name="uniteIngredientPrincipal"
                        required
                        className="w-full text-sm px-4 py-2 border rounded-md focus:ring-2 focus:ring-doctor-orange focus:outline-none">
                        <option value="">-- Sélectionner une unité --</option>
                        <option value="kg">Kilogramme (kg)</option>
                        <option value="l">Litre (L)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded-md p-4">
                <legend className="text-sm font-bold text-doctor-red italic px-2">
                  🌿 Ingrédients secondaires
                </legend>
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    {ingredientsSecondaires.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-doctor-cream p-3 rounded flex items-center justify-between">
                        <p className="text-sm text-doctor-red">
                          {item.nom} – {item.quantite} {item.unite}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSecIngredient(item);
                              setSecQuantite(item.quantite);
                              setSecUnite(item.unite);
                              setShowSecDialog(true);
                            }}
                            className="text-xs text-blue-600 hover:underline">
                            Modifier
                          </button>
                          <button
                            onClick={() => {
                              setIngredientsSecondaires((prev) =>
                                prev.filter((_, i) => i !== idx)
                              );
                            }}
                            className="text-xs text-red-600 hover:underline">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Combobox
                    value={selectedSecIngredient}
                    onChange={setSelectedSecIngredient}>
                    <div className="relative flex gap-2 items-center">
                      <div className="flex-1 relative">
                        <Combobox.Input
                          className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-doctor-orange"
                          displayValue={(ingredient) => ingredient?.nom || ""}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Chercher un ingrédient..."
                        />

                        {filteredIngredients.length > 0 && (
                          <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-auto">
                            {filteredIngredients.map((ingredient) => (
                              <Combobox.Option
                                key={ingredient.id}
                                value={ingredient}
                                className={({ active }) =>
                                  `cursor-pointer px-4 py-2 text-sm ${
                                    active
                                      ? "bg-doctor-orange text-white"
                                      : "text-gray-800"
                                  }`
                                }>
                                {ingredient.nom}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!selectedSecIngredient}
                        onClick={() => setShowSecDialog(true)}
                        className="bg-doctor-red text-white px-3 py-2 rounded hover:bg-doctor-deeporange text-sm disabled:opacity-50">
                        Ajouter
                      </button>
                    </div>
                  </Combobox>

                  {showSecDialog && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
                      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                        <h3 className="text-lg font-bold mb-4 text-doctor-red">
                          Quantité de {selectedSecIngredient?.nom}
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm mb-1">
                              Quantité
                            </label>
                            <input
                              type="number"
                              value={secQuantite}
                              onChange={(e) => setSecQuantite(e.target.value)}
                              className="w-full px-4 py-2 border rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Unité</label>
                            <select
                              value={secUnite}
                              onChange={(e) => setSecUnite(e.target.value)}
                              className="w-full px-4 py-2 border rounded-md"
                              required>
                              <option value="">
                                -- Sélectionner une unité --
                              </option>
                              <option value="g">gramme (g)</option>
                              <option value="kg">kilogramme (kg)</option>
                              <option value="ml">millilitre (ml)</option>
                              <option value="l">litre (L)</option>
                            </select>
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <button
                              onClick={() => setShowSecDialog(false)}
                              className="text-sm px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
                              Annuler
                            </button>
                            <button
                              onClick={() => {
                                const updated = {
                                  nom: selectedSecIngredient.nom,
                                  quantite: secQuantite,
                                  unite: secUnite,
                                };

                                setIngredientsSecondaires((prev) => {
                                  // Si on modifie un existant
                                  const found = prev.find(
                                    (p) => p.nom === updated.nom
                                  );
                                  if (found) {
                                    return prev.map((p) =>
                                      p.nom === updated.nom ? updated : p
                                    );
                                  } else {
                                    return [...prev, updated];
                                  }
                                });

                                // Reset
                                setShowSecDialog(false);
                                setSecQuantite("");
                                setSecUnite("");
                                setSelectedSecIngredient(null);
                              }}
                              className="text-sm px-4 py-2 bg-doctor-red text-white rounded hover:bg-doctor-deeporange">
                              Valider
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

              <fieldset className="border border-gray-300 rounded-md p-4">
                <legend className="text-sm font-bold italic text-doctor-red px-2">
                  🔧 Utilitaires
                </legend>

                <div className="mt-2 space-y-4">
                  <label className="block text-sm mb-1">
                    Ajouter un utilitaire
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="w-full relative">
                      <Combobox
                        value={selectedUtilitaire}
                        onChange={setSelectedUtilitaire}>
                        <Combobox.Input
                          className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-doctor-orange"
                          displayValue={(item) => item?.nom || ""}
                          onChange={(e) => setQueryUtilitaire(e.target.value)}
                        />
                        <Combobox.Options className="absolute mt-1 w-full bg-white border rounded shadow-lg z-10 max-h-60 overflow-auto">
                          {utilitaires
                            .filter((u) =>
                              u.nom
                                .toLowerCase()
                                .includes(queryUtilitaire.toLowerCase())
                            )
                            .map((util) => (
                              <Combobox.Option key={util.id} value={util}>
                                {({ active }) => (
                                  <div
                                    className={`px-4 py-2 cursor-pointer ${
                                      active
                                        ? "bg-doctor-orange text-white"
                                        : ""
                                    }`}>
                                    {`${util.icone} ${util.nom}`}
                                  </div>
                                )}
                              </Combobox.Option>
                            ))}
                        </Combobox.Options>
                      </Combobox>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        selectedUtilitaire && setShowUtilitaireDialog(true)
                      }
                      disabled={!selectedUtilitaire}
                      className="bg-doctor-red text-white px-3 py-2 rounded hover:bg-doctor-deeporange text-sm disabled:opacity-50">
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-2">
                    {utilitairesChoisis?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-doctor-cream p-3 rounded flex items-center justify-between">
                        <p className="text-sm text-doctor-red">
                          {`${item.icone} ${item.nom} – ${item.quantite} ${item.unite}`}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedUtilitaire(item);
                              setUtilitaireQuantite(item.quantite);
                              setUtilitaireUnite(item.unite);
                              setShowUtilitaireDialog(true);
                            }}
                            className="text-xs text-blue-600 hover:underline">
                            Modifier
                          </button>
                          <button
                            onClick={() =>
                              setUtilitairesChoisis((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-xs text-red-600 hover:underline">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {showUtilitaireDialog && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                      <h3 className="text-lg font-bold mb-4 text-doctor-red">
                        Quantité de {selectedUtilitaire?.nom}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Quantité</label>
                          <input
                            type="number"
                            value={utilitaireQuantite}
                            onChange={(e) =>
                              setUtilitaireQuantite(e.target.value)
                            }
                            className="w-full px-4 py-2 border rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Unité</label>
                          <select
                            value={utilitaireUnite}
                            onChange={(e) => setUtilitaireUnite(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required>
                            <option value="">
                              -- Sélectionner une unité --
                            </option>
                            <option value=".">Unité (.)</option>
                            <option value="g">Gramme (g)</option>
                            <option value="kg">Kilogramme (Kg)</option>
                            <option value="l">Litre (L)</option>
                          </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            onClick={() => setShowUtilitaireDialog(false)}
                            className="text-sm px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              const updated = {
                                nom: selectedUtilitaire.nom,
                                icone: selectedUtilitaire.icone,
                                quantite: utilitaireQuantite,
                                unite: utilitaireUnite,
                              };

                              setUtilitairesChoisis((prev) => {
                                const found = prev.find(
                                  (p) => p.nom === updated.nom
                                );
                                if (found) {
                                  return prev.map((p) =>
                                    p.nom === updated.nom ? updated : p
                                  );
                                } else {
                                  return [...prev, updated];
                                }
                              });

                              // Reset
                              setShowUtilitaireDialog(false);
                              setUtilitaireQuantite("");
                              setUtilitaireUnite("");
                              setSelectedUtilitaire(null);
                            }}
                            className="text-sm px-4 py-2 bg-doctor-red text-white rounded hover:bg-doctor-deeporange">
                            Valider
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </fieldset>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {action === "use" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          i want to use it
        </div>
      )}
    </>
  );
};

export default DialogProduction;
