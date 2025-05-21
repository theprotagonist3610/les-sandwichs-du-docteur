// ✅ Code ajusté pour le composant Menus avec responsive complet + quantité interactive stylisée

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
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
import { Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cloudinaryConfig } from "../firebase";
function AddImage({ onUpload }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.preset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
        toast.success("Image envoyée avec succès");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Erreur lors de l'envoi de l'image");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-doctor-orange file:text-white hover:file:bg-doctor-deeporange cursor-pointer"
      />
    </div>
  );
}
export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQtyDialog, setOpenQtyDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientQty, setIngredientQty] = useState(0);
  const [editing, setEditing] = useState(null);
  const [allIngredients, setAllIngredients] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    prix: "",
    description: "",
    image: "",
    ingredients: [],
  });

  const typesCouleurs = [
    {
      label: "Céréales",
      type: "cereales",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Racines / Féculents",
      type: "racines/feculents",
      color: "bg-orange-100 text-orange-800",
    },
    { label: "Légumes", type: "legumes", color: "bg-green-100 text-green-800" },
    { label: "Fruits", type: "fruits", color: "bg-pink-100 text-pink-800" },
    {
      label: "Noix / Graines",
      type: "noix/graines",
      color: "bg-amber-100 text-amber-800",
    },
    {
      label: "Viande rouge",
      type: "viande rouge",
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Viande blanche",
      type: "viande blanche",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Œufs et dérivés",
      type: "oeufs et derives",
      color: "bg-yellow-200 text-yellow-900",
    },
    {
      label: "Poissons et dérivés",
      type: "poissons et derives",
      color: "bg-sky-100 text-sky-800",
    },
    {
      label: "Lait et dérivés",
      type: "lait et derives",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      label: "Matières grasses",
      type: "matieres grasses",
      color: "bg-lime-100 text-lime-800",
    },
    { label: "Boissons", type: "boissons", color: "bg-cyan-100 text-cyan-800" },
    { label: "Épices", type: "epice", color: "bg-yellow-100 text-yellow-800" },
  ];

  const fetchIngredients = async () => {
    const snapshot = await getDocs(collection(db, "ingredients"));
    setAllIngredients(
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const fetchMenus = async () => {
    const snapshot = await getDocs(collection(db, "menus"));
    setMenus(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchMenus();
    fetchIngredients();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, "menus", editing.id), form);
        await updateDoc(doc(db, "stock", form.menu_id), {
          nom: form.nom,
          prix: form.prix,
          ingredients: form.ingredients.length,
          menu_id: menu_id,
          type: "consommable",
          //...
        });
        toast.success("Menu mis à jour !");
      } else {
        const menu_id = `consommable_${new Date().getTime()}`;
        await addDoc(collection(db, "menus"), { ...form, menu_id });
        await setDoc(doc(db, "stock", menu_id), {
          nom: form.nom,
          prix: form.prix,
          ingredients: form.ingredients.length,
          menu_id: menu_id,
          type: "consommable",
          //...
        });
        //enregistrer dans stock aussi en tant que consommable
        toast.success("Menu ajouté !");
      }
      setForm({
        nom: "",
        prix: "",
        description: "",
        image: "",
        ingredients: [],
      });
      setEditing(null);
      setOpenDialog(false);
      fetchMenus();
    } catch (err) {
      console.log(err.message);
      toast.error("Erreur d'enregistrement");
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      await deleteDoc(doc(db, "menus", editing.id));
      toast.success("Menu supprimé !");
      setForm({
        nom: "",
        prix: "",
        description: "",
        image: "",
        ingredients: [],
      });
      setEditing(null);
      setOpenDialog(false);
      fetchMenus();
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleIngredientClick = (ingredient) => {
    const exists = form.ingredients.find((i) => i.nom === ingredient.nom);
    if (exists) {
      setForm((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((i) => i.nom !== ingredient.nom),
      }));
    } else {
      setSelectedIngredient(ingredient);
      setOpenQtyDialog(true);
    }
  };

  const confirmQty = () => {
    if (!selectedIngredient) return;
    const withQty = { ...selectedIngredient, quantite: Number(ingredientQty) };
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, withQty],
    }));
    setIngredientQty(0);
    setSelectedIngredient(null);
    setOpenQtyDialog(false);
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
      case "epice":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-doctor-red mb-4">Menus</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setForm({
              nom: "",
              prix: "",
              description: "",
              image: "",
              ingredients: [],
            });
            setEditing(null);
            setOpenDialog(true);
          }}
          className="flex items-center justify-center border-2 border-dashed border-doctor-deeporange text-doctor-deeporange h-40 rounded-lg cursor-pointer hover:bg-[--color-doctor-cream]">
          <span className="text-4xl font-bold">+</span>
        </div>
        {menus.map((menu) => (
          <div
            key={menu.id}
            onClick={() => {
              setForm(menu);
              setEditing(menu);
              setOpenDialog(true);
            }}
            className="border rounded-lg p-4 shadow bg-white hover:shadow-md cursor-pointer">
            <img
              src={
                menu.image || "https://via.placeholder.com/400x200?text=Menu"
              }
              className="w-full h-32 sm:h-40 object-cover rounded mb-2"
              alt={menu.nom}
            />
            <h3 className="font-bold text-doctor-deeporange">{menu.nom}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {menu.description}
            </p>
            <p className="text-sm font-semibold text-doctor-red">
              {menu.prix} FCFA
            </p>
            {menu.caloriesTotal && (
              <p className="text-sm text-gray-600 italic">
                ~ {menu.caloriesTotal} kcal
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {menu.ingredients?.map((ing, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded-full ${getBadgeStyle(
                    ing.type
                  )}`}>
                  {ing.nom} {ing.quantite ? `(${ing.quantite}g)` : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {openDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="max-w-full sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editing ? "Modifier le menu" : "Nouveau menu"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <input
                    className="input w-full"
                    placeholder="Nom"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  />
                  <input
                    className="input w-full"
                    placeholder="Prix"
                    value={form.prix}
                    onChange={(e) => setForm({ ...form, prix: e.target.value })}
                  />
                  <textarea
                    className="input w-full"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <AddImage
                    onUpload={(url) => setForm({ ...form, image: url })}
                  />
                  <div>
                    <h4 className="font-semibold mb-2">Ingrédients</h4>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {typesCouleurs.map(({ label, color, type }) => (
                        <div
                          key={type}
                          className="flex items-center gap-1 text-sm">
                          <span
                            className={`w-3 h-3 rounded-full inline-block ${color}`}
                          />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allIngredients.map((ing) => {
                        const selected = form.ingredients?.some(
                          (i) => i.nom === ing.nom
                        );
                        const selectedIng = form.ingredients.find(
                          (i) => i.nom === ing.nom
                        );
                        return (
                          <button
                            key={ing.id}
                            type="button"
                            onClick={() => handleIngredientClick(ing)}
                            className={`relative text-xs px-3 py-1 rounded-full border transition-all duration-200 ${getBadgeStyle(
                              ing.type
                            )} ${
                              selected
                                ? "ring-2 ring-doctor-deeporange"
                                : "opacity-80"
                            }`}>
                            {ing.nom}{" "}
                            {selectedIng?.quantite
                              ? `(${selectedIng.quantite}g)`
                              : ""}
                            {selected && (
                              <Pin
                                size={12}
                                className="absolute -top-1 -right-1 text-doctor-red"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={openQtyDialog} onOpenChange={setOpenQtyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Saisir la quantité de {selectedIngredient?.nom}
            </DialogTitle>
          </DialogHeader>
          <input
            type="number"
            value={ingredientQty}
            onChange={(e) => setIngredientQty(e.target.value)}
            className="input w-full"
            placeholder="Quantité en grammes"
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenQtyDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmQty}>Valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
