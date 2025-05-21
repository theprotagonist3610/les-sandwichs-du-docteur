import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  doc as docRef,
} from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { toast } from "sonner"; // optionnel si tu as un toast system

const ProductionsEnCours = () => {
  const [productions, setProductions] = useState([]);
  const [selectedProd, setSelectedProd] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultat, setResultat] = useState("");
  const [uniteResultat, setUniteResultat] = useState("");

  const fetchProductions = async () => {
    const snapshot = await getDocs(collection(db, "productionencours"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProductions(data);
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleTerminer = async () => {
    if (!resultat || !uniteResultat || !selectedProd) return;

    const dateFin = new Date();

    await setDoc(docRef(db, "productionterminees", selectedProd.id), {
      ...selectedProd,
      quantiteObtenue: resultat,
      uniteObtenue: uniteResultat,
      dateFin,
    });

    await deleteDoc(docRef(db, "productionencours", selectedProd.id));

    // Effet visuel
    const card = document.getElementById(`prod-${selectedProd.id}`);
    if (card) {
      card.classList.add("animate-pulse", "bg-green-100");
      setTimeout(() => {
        card.classList.remove("animate-pulse", "bg-green-100");
      }, 800);
    }

    toast.success("Production terminée !");
    setShowResultDialog(false);
    setSelectedProd(null);
    setResultat("");
    setUniteResultat("");
    fetchProductions(); // Refresh liste
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {productions.map((prod) => (
        <Dialog key={prod.id}>
          <DialogTrigger asChild>
            <div
              id={`prod-${prod.id}`}
              onClick={() => setSelectedProd(prod)}
              className="cursor-pointer p-4 border border-doctor-red rounded-xl bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <h3 className="text-lg font-bold text-doctor-deeporange">
                {prod.nom || "Production sans nom"}
              </h3>
              <p className="text-sm text-doctor-red mt-1">
                Ingrédient : {prod.ingredientPrincipal?.nom} (
                {prod.ingredientPrincipal?.unite})
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                Démarrée le :{" "}
                {prod?.dateCreation?.toDate?.().toLocaleDateString("fr-FR")}
              </p>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-doctor-orange">
                {selectedProd?.nom || "Production"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm">
                Quantité prévue : <strong>{selectedProd?.quantite}</strong>
              </p>
              <p className="text-sm">
                Ingrédient : {selectedProd?.ingredientPrincipal?.nom} (
                {selectedProd?.ingredientPrincipal?.unite})
              </p>
              <p className="text-xs italic">
                Lancement :{" "}
                {selectedProd?.dateCreation
                  ?.toDate?.()
                  .toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
              <Button
                onClick={() => setShowResultDialog(true)}
                className="bg-green-600 text-white hover:bg-green-700">
                Terminer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {showResultDialog && (
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-doctor-red">Résultat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantité obtenue
                </label>
                <input
                  type="number"
                  value={resultat}
                  onChange={(e) => setResultat(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unité</label>
                <select
                  value={uniteResultat}
                  onChange={(e) => setUniteResultat(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  required>
                  <option value="">-- Sélectionner une unité --</option>
                  <option value={selectedProd?.ingredientPrincipal?.unite}>
                    {selectedProd?.ingredientPrincipal?.unite} (par défaut)
                  </option>
                  <option value="kg">Kilogramme (Kg)</option>
                  <option value="l">Litre (L)</option>
                  <option value="g">Gramme (g)</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleTerminer}
                  disabled={!resultat || !uniteResultat}
                  className="bg-doctor-red text-white disabled:opacity-50 disabled:cursor-not-allowed">
                  Confirmer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductionsEnCours;
