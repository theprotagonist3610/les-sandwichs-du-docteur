// ✅ Composant ProductionsTerminees
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const ProductionsTerminees = () => {
  const [productions, setProductions] = useState([]);
  const [selectedProd, setSelectedProd] = useState(null);

  useEffect(() => {
    const fetchProductions = async () => {
      const snapshot = await getDocs(collection(db, "productionterminees"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductions(data);
    };
    fetchProductions();
  }, []);

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
                Résultat : {prod.resultat} {prod.uniteResultat}
              </p>
              <p className="text-xs italic">
                Terminé le :{" "}
                {prod.dateFin?.toDate?.().toLocaleDateString("fr-FR") || "?"}
              </p>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-doctor-orange">
                Détails de la production
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p>
                Ingrédient principal : {prod.ingredientPrincipal.nom} (
                {prod.ingredientPrincipal.unite})
              </p>
              <p>
                Résultat :{" "}
                <strong>
                  {prod.resultat} {prod.uniteResultat}
                </strong>
              </p>
              <p>
                Date de fin :{" "}
                {prod.dateFin?.toDate?.().toLocaleString("fr-FR") || "?"}
              </p>
              <p className="text-xs italic">ID : {prod.id}</p>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default ProductionsTerminees;
