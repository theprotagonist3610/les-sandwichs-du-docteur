// ✅ SuperMenus : ajout bilan par type + dialog de saisie des quantités d’ingrédients

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
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
import { cloudinaryConfig } from "../firebase";
const getBadgeStyle = (type) => {
  switch (type) {
    case "legumes":
      return "bg-green-200 text-green-800";
    case "epice":
      return "bg-yellow-200 text-yellow-800";
    case "viande blanche":
      return "bg-blue-200 text-blue-800";
    case "viande rouge":
      return "bg-red-200 text-red-800";
    case "cereales":
      return "bg-yellow-100 text-yellow-800";
    case "racines/feculents":
      return "bg-orange-100 text-orange-800";
    case "fruits":
      return "bg-pink-100 text-pink-800";
    case "noix/graines":
      return "bg-amber-100 text-amber-800";
    case "oeufs et derives":
      return "bg-yellow-200 text-yellow-900";
    case "poissons et derives":
      return "bg-sky-100 text-sky-800";
    case "lait et derives":
      return "bg-indigo-100 text-indigo-800";
    case "matieres grasses":
      return "bg-lime-100 text-lime-800";
    case "boissons":
      return "bg-cyan-100 text-cyan-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};
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

export default function SuperMenus() {
  const [superMenus, setSuperMenus] = useState([]);
  const [menus, setMenus] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    image: "",
    prix: "",
    menus: [],
    ingredients: [],
    caloriesTotal: 0,
  });
  const [ingredientQtyDialog, setIngredientQtyDialog] = useState(false);
  const [menuQtyDialog, setMenuQtyDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantite, setQuantite] = useState(0);

  const fetchMenus = async () => {
    const snapshot = await getDocs(collection(db, "menus"));
    setMenus(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchIngredients = async () => {
    const snapshot = await getDocs(collection(db, "ingredients"));
    setIngredients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchSuperMenus = async () => {
    const snapshot = await getDocs(collection(db, "super_menus"));
    setSuperMenus(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchMenus();
    fetchIngredients();
    fetchSuperMenus();
  }, []);

  const updateCaloriesTotal = (ingredientsList) => {
    const total = ingredientsList.reduce((acc, ing) => {
      const quantite = parseFloat(ing.quantite || 0);
      const cal = parseFloat(ing.calories || 0);
      return acc + (quantite * cal) / 100;
    }, 0);
    setForm((prev) => ({ ...prev, caloriesTotal: Math.round(total) }));
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, "super_menus", editing.id), form);
        toast.success("Super menu mis à jour !");
      } else {
        await addDoc(collection(db, "super_menus"), form);
        toast.success("Super menu ajouté !");
      }
      setForm({
        nom: "",
        description: "",
        menus: [],
        ingredients: [],
        prix: "",
        caloriesTotal: 0,
      });
      setEditing(null);
      setOpenDialog(false);
      fetchSuperMenus();
    } catch (err) {
      toast.error("Erreur d'enregistrement");
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      await deleteDoc(doc(db, "super_menus", editing.id));
      toast.success("Super menu supprimé !");
      setEditing(null);
      setOpenDialog(false);
      fetchSuperMenus();
    } catch (e) {
      toast.error("Échec de suppression");
    }
  };

  const handleIngredientSelect = (ingredient) => {
    const already = form.ingredients.find((i) => i.nom === ingredient.nom);
    if (already) {
      const list = form.ingredients.filter((i) => i.nom !== ingredient.nom);
      setForm((prev) => ({ ...prev, ingredients: list }));
      updateCaloriesTotal(list);
    } else {
      setSelectedIngredient(ingredient);
      setQuantite(0);
      setIngredientQtyDialog(true);
    }
  };
  const handleMenuSelect = (menu) => {
    const already = form.menus.find((m) => m.id === menu.id);
    if (already) {
      const list = form.menus.filter((m) => m.id !== menu.id);
      setForm((prev) => ({ ...prev, menus: list }));
    } else {
      setSelectedMenu(menu);
      setQuantite(0);
      setMenuQtyDialog(true);
    }
  };
  const confirmIngredientQty = () => {
    const withQte = { ...selectedIngredient, quantite: parseFloat(quantite) };
    const updatedList = [...form.ingredients, withQte];
    setForm((prev) => ({ ...prev, ingredients: updatedList }));
    updateCaloriesTotal(updatedList);
    setSelectedIngredient(null);
    setQuantite(0);
    setIngredientQtyDialog(false);
  };

  const groupByType = (items) => {
    return items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
  };
  const confirmMenuQty = () => {
    const withQte = { ...selectedMenu, quantite: parseFloat(quantite) };
    const updatedList = [...form.menus, withQte];
    setForm((prev) => ({ ...prev, menus: updatedList }));
    setSelectedMenu(null);
    setQuantite(0);
    setMenuQtyDialog(false);
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-doctor-red mb-4">Super Menus</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setForm({
              nom: "",
              description: "",
              menus: [],
              ingredients: [],
              prix: "",
              caloriesTotal: 0,
            });
            setEditing(null);
            setOpenDialog(true);
          }}
          className="flex items-center justify-center border-2 border-dashed border-doctor-deeporange text-doctor-deeporange h-40 rounded-lg cursor-pointer hover:bg-[--color-doctor-cream]">
          <span className="text-4xl font-bold">+</span>
        </div>

        {superMenus.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              setForm(s);
              setEditing(s);
              setOpenDialog(true);
            }}
            className="border rounded-lg p-4 shadow bg-white hover:shadow-md cursor-pointer">
            <h3 className="font-bold text-doctor-deeporange">{s.nom}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {s.description}
            </p>
            <p className="text-sm font-semibold text-doctor-red">
              {s.prix} FCFA
            </p>
            {s.caloriesTotal && (
              <p className="text-sm text-gray-500 italic">
                ~ {s.caloriesTotal} kcal
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {s.menus?.map((m, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800">
                  🥪 {m.nom} ({m.quantite})
                </span>
              ))}
              {s.ingredients?.map((i, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  🧂 {i.nom} ({i.quantite}g)
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier le super menu" : "Nouveau super menu"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <input
              className="input w-full"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
            <textarea
              className="input w-full"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <AddImage onUpload={(url) => setForm({ ...form, image: url })} />
            <input
              className="input w-full"
              placeholder="Prix"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
            />

            <div>
              <h4 className="font-semibold mb-2">Menus à inclure</h4>
              <div className="flex flex-wrap gap-2">
                {menus.map((m) => {
                  const selected = form.menus?.some((i) => i.id === m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMenuSelect(m)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
                        selected
                          ? "bg-doctor-orange text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      <span>{`${m.nom} ${
                        m.quantite ? "(" + m.quantite + ")" : ""
                      }`}</span>
                      {selected && <Pin size={12} className="inline ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Ingrédients à ajouter</h4>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing) => {
                  const selected = form.ingredients?.some(
                    (i) => i.nom === ing.nom
                  );
                  return (
                    <button
                      key={ing.id}
                      type="button"
                      onClick={() => handleIngredientSelect(ing)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
                        selected
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      <span>{`${ing.nom} ${
                        ing.quantite ? "(" + ing.quantite + ")" : ""
                      }`}</span>
                      {selected && <Pin size={12} className="inline ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-right text-sm text-gray-600 italic">
              Calories estimées : {form.caloriesTotal} kcal
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:space-x-2">
            {editing && (
              <Button variant="destructive" onClick={() => handleDelete()}>
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

      <Dialog open={ingredientQtyDialog} onOpenChange={setIngredientQtyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quantité pour {selectedIngredient?.nom}</DialogTitle>
          </DialogHeader>
          <input
            type="number"
            className="input w-full"
            placeholder="Quantité en grammes"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIngredientQtyDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmIngredientQty}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={menuQtyDialog} onOpenChange={setMenuQtyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quantité pour {selectedMenu?.nom}</DialogTitle>
          </DialogHeader>
          <input
            type="number"
            className="input w-full"
            placeholder="Quantité"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setMenuQtyDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmMenuQty}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
