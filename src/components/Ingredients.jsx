// ✅ Version responsive du composant Ingredients

import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
export default function Ingredients() {
  const hasFetched = useRef(false);
  const [ingredients, setIngredients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    type: "",
    provenance: "",
    calories: "",
  });
  const referenceIngredients = async () => {
    const response = await fetch("/ingredients_ouest_afrique.json");
    const json = await response.json();
    return json;
  };
  const getBadgeStyle = (type) => {
    switch (type.toLowerCase()) {
      case "cereales":
        return "bg-yellow-100 text-yellow-800";
      case "racines/feculents":
        return "bg-orange-100 text-orange-800";
      case "legumes":
        return "bg-green-100 text-green-800";
      case "fruits":
        return "bg-pink-100 text-pink-800";
      case "noix/graines":
        return "bg-amber-100 text-amber-800";
      case "viande rouge":
        return "bg-red-100 text-red-800";
      case "viande blanche":
        return "bg-blue-100 text-blue-800";
      case "oeufs et derives":
        return "bg-yellow-200 text-yellow-900";
      case "poissons et derives":
        return "bg-sky-100 text-sky-800";
      case "lait et derives":
        return "bg-indigo-100 text-indigo-800";
      case "matieres grasses":
        return "bg-lime-100 text-lime-800";
      case "boissons et autres":
        return "bg-cyan-100 text-cyan-800";
      case "epices":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getColorByType = (type) => {
    switch (type.toLowerCase()) {
      case "cereales":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "racines/feculents":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "legumes":
        return "bg-green-100 text-green-800 border-green-300";
      case "fruits":
        return "bg-pink-100 text-pink-800 border-pink-300";
      case "noix/graines":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "viande rouge":
        return "bg-red-100 text-red-800 border-red-300";
      case "viande blanche":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "oeufs et derives":
        return "bg-yellow-200 text-yellow-900 border-yellow-400";
      case "poissons et derives":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "lait et derives":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "matieres grasses":
        return "bg-lime-100 text-lime-800 border-lime-300";
      case "boissons et autres":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "epices":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const fetchIngredients = async () => {
    const snapshot = await getDocs(collection(db, "ingredients"));
    const existing = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setIngredients(existing);
    const reference = await referenceIngredients();
    const existingNames = existing.map((item) => item.nom);

    const toAdd = reference.filter((item) => !existingNames.includes(item.nom));
    for (const ing of toAdd) {
      const ing_id = `perissable_${new Date().getTime()}`;
      await addDoc(collection(db, "ingredients"), {
        ...ing,
        ingredient_id: ing_id,
        unite: "",
        provenance: "",
      });
      await setDoc(doc(db, "stock", ing_id), {
        ...ing,
        ingredient_id: ing_id,
        unite: "",
        provenance: "",
        type: "périssable",
      });
    }
    if (toAdd.length > 0) {
      const updated = await getDocs(collection(db, "ingredients"));
      setIngredients(
        updated.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchIngredients();
  }, []);

  const handleSave = async () => {
    try {
      const nomNormalise = form.nom.trim().toLowerCase();
      // const exists = ingredients.some(
      //   (ing) =>
      //     ing.nom.trim().toLowerCase() === nomNormalise &&
      //     (!editing || ing.id !== editing.id)
      // );

      // if (exists) {
      //   toast.warning("❗Cet ingrédient existe déjà.");
      //   return;
      // }

      if (editing) {
        await updateDoc(doc(db, "ingredients", editing.id), form);
        await updateDoc(doc(db, "stock", form.ingredient_id), form);
        toast.success("Ingrédient mis à jour !");
      } else {
        const ing_id = `perissable_${new Date().getTime()}`;
        await addDoc(collection(db, "ingredients"), {
          ...form,
          ingredient_id: ing_id,
          type: "périssable",
        });
        await setDoc(doc(db, "stock", ing_id), {
          ...form,
          ingredient_id: ing_id,
          type: "périssable",
        });
        toast.success("Ingrédient ajouté !");
      }
      setForm({
        nom: "",
        type: "",
        provenance: "",
        calories: "",
        icone: "",
        unite: "",
      });
      setEditing(null);
      setOpenDialog(false);
      fetchIngredients();
    } catch (err) {
      toast.error("Erreur d'enregistrement");
    }
  };

  const handleDelete = async () => {
    if (editing) {
      await deleteDoc(doc(db, "ingredients", editing.id));
      await deleteDoc(doc(db, "stock", editing.ingredient_id));
      toast.success("Ingrédient supprimé !");
      setForm({
        nom: "",
        type: "",
        provenance: "",
        calories: "",
        icone: "",
        unite: "",
      });
      setEditing(null);
      setOpenDialog(false);
      fetchIngredients();
    }
  };

  const openForEdit = (ingredient) => {
    setForm(ingredient);
    setEditing(ingredient);
    setOpenDialog(true);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-doctor-red mb-4">Ingrédients</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setForm({ nom: "", type: "", provenance: "", calories: "" });
            setEditing(null);
            setOpenDialog(true);
          }}
          className="flex items-center justify-center border-2 border-dashed border-doctor-deeporange text-doctor-deeporange h-32 rounded-lg cursor-pointer hover:bg-doctor-cream">
          <span className="text-4xl font-bold">+</span>
        </div>

        {ingredients.map((ing) => (
          <div
            key={ing.id}
            onClick={() => openForEdit(ing)}
            className={`border rounded-lg p-4 shadow cursor-pointer hover:shadow-md ${getColorByType(
              ing.type
            )}`}>
            <h3 className="font-bold text-lg">{`${ing.icone} ${ing.nom} (${ing.unite})`}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full inline-block font-medium mt-1 mb-2 ${getBadgeStyle(
                ing.type
              )}`}>
              {ing.nom_type}
            </span>
            <p className="text-sm">Provenance : {ing.provenance}</p>
            <p className="text-sm">
              Calories / 100g : <strong>{ing.calories}</strong>
            </p>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier l'ingrédient" : "Nouvel ingrédient"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <input
              className="input w-full"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
            <select
              className="input w-full"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="">Sélectionner un type</option>
              <option value="cereales">Céréales</option>
              <option value="racines/feculents">Racines / Féculents</option>
              <option value="legumes">Légumes</option>
              <option value="fruits">Fruits</option>
              <option value="noix/graines">Noix / Graines</option>
              <option value="viande rouge">Viande rouge</option>
              <option value="viande blanche">Viande blanche</option>
              <option value="oeufs et derives">Œufs et dérivés</option>
              <option value="poissons et derives">Poissons et dérivés</option>
              <option value="lait et derives">Lait et dérivés</option>
              <option value="matieres grasses">Matières grasses</option>
              <option value="boissons et autres">Boissons et autres</option>
              <option value="epices">Epices</option>
              <option value="aromatique">Aromatique</option>
            </select>
            <select
              className="input w-full"
              value={form.unite}
              onChange={(e) => setForm({ ...form, unite: e.target.value })}>
              <option value="">Sélectionner une unite de mesure</option>
              <option value="g">Grammes</option>
              <option value="Kg">Kilogrammes</option>
              <option value="L">Litres</option>
              <option value="ml">Millilitres</option>
            </select>
            <input
              className="input w-full"
              placeholder="Provenance"
              value={form.provenance}
              onChange={(e) => setForm({ ...form, provenance: e.target.value })}
            />
            <input
              className="input w-full"
              placeholder="Icone"
              value={form.icone}
              onChange={(e) => setForm({ ...form, icone: e.target.value })}
            />
            <input
              className="input w-full"
              type="number"
              placeholder="Calories / 100g"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:space-x-2">
            {editing && (
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            )}
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
