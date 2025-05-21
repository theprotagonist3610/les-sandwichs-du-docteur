// ✅ Composant ProductionsProgrammees
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
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

const ProductionsProgrammees = () => {
  const [productions, setProductions] = useState([]);
  const [selectedProd, setSelectedProd] = useState(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [quantite, setQuantite] = useState("");

  useEffect(() => {
    const fetchProductions = async () => {
      const snapshot = await getDocs(collection(db, "productionsprogrammees"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductions(data);
    };
    fetchProductions();
  }, []);

  const handleStartProduction = async () => {
    if (!quantite) return;
    const docRef = doc(db, "productionencours", selectedProd.id);
    await setDoc(docRef, {
      ...selectedProd,
      quantite,
      dateDebut: Timestamp.now(),
    });
    await deleteDoc(doc(db, "productionsprogrammees", selectedProd.id));
    setQuantite("");
    setSelectedProd(null);
    setShowStartDialog(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {productions.map((prod) => (
        <Dialog key={prod.id}>
          <DialogTrigger asChild>
            <div
              onClick={() => setSelectedProd(prod)}
              className="border p-4 bg-doctor-cream text-doctor-red rounded-lg shadow hover:shadow-lg cursor-pointer">
              <h3 className="font-semibold text-doctor-deeporange">
                {prod.nom || prod.id}
              </h3>
              <p className="text-sm mt-1">
                Ingrédient : {prod.ingredientPrincipal.nom}
              </p>
              <p className="text-xs italic">
                Programmée pour le :{" "}
                {prod.dateProgrammation?.toDate?.().toLocaleString("fr-FR")}
              </p>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-doctor-orange">
                {prod.nom || "Production programmée"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm">
                Ingrédient principal : {prod.ingredientPrincipal.nom} (
                {prod.ingredientPrincipal.unite})
              </p>
              <p className="text-xs italic">
                Date de programmation :{" "}
                {prod.dateProgrammation?.toDate?.().toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
              <Button
                onClick={() => setShowStartDialog(true)}
                className="bg-green-600 text-white hover:bg-green-700">
                Démarrer maintenant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {showStartDialog && (
        <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-doctor-red">
                Démarrer la production
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Quantité à produire
              </label>
              <input
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleStartProduction}
                  className="bg-doctor-red text-white">
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

export default ProductionsProgrammees;
