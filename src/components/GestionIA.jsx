// ✅ Composant de gestion des accroches IA dans Firestore (avec filtre)

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const GestionIA = ({ show }) => {
  const [accroches, setAccroches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ imc: "", sexe: "", calories: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    texte: "",
    conditions: { imc: "", sexe: "", calories: "" },
  });

  const fetchAccroches = async () => {
    const snapshot = await getDocs(collection(db, "accroches"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAccroches(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchAccroches();
  }, []);

  useEffect(() => {
    const f = accroches.filter((a) => {
      return ["imc", "sexe", "calories"].every((key) => {
        return !filters[key] || a.conditions?.[key] === filters[key];
      });
    });
    setFiltered(f);
  }, [filters, accroches]);

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDoc(doc(db, "accroches", editing.id), form);
        toast.success("Accroche mise à jour");
      } else {
        await addDoc(collection(db, "accroches"), form);
        toast.success("Accroche ajoutée");
      }
      setForm({ texte: "", conditions: { imc: "", sexe: "", calories: "" } });
      setEditing(null);
      setOpenDialog(false);
      fetchAccroches();
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "accroches", editing.id));
      toast.success("Accroche supprimée");
      setForm({ texte: "", conditions: { imc: "", sexe: "", calories: "" } });
      setEditing(null);
      setOpenDialog(false);
      fetchAccroches();
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className={`p-6 ${show}`}>
      <h2 className="text-2xl font-bold text-doctor-red mb-4">
        Gestion des accroches IA
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          className="input"
          value={filters.imc}
          onChange={(e) => setFilters({ ...filters, imc: e.target.value })}>
          <option value="">IMC</option>
          <option value="maigre">Maigre</option>
          <option value="normal">Normal</option>
          <option value="surpoids">Surpoids</option>
          <option value="obese">Obèse</option>
        </select>
        <select
          className="input"
          value={filters.sexe}
          onChange={(e) => setFilters({ ...filters, sexe: e.target.value })}>
          <option value="">Sexe</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
        <select
          className="input"
          value={filters.calories}
          onChange={(e) =>
            setFilters({ ...filters, calories: e.target.value })
          }>
          <option value="">Calories</option>
          <option value="bas">Bas</option>
          <option value="normal">Normal</option>
          <option value="élevé">Élevé</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          onClick={() => {
            setForm({
              texte: "",
              conditions: { imc: "", sexe: "", calories: "" },
            });
            setEditing(null);
            setOpenDialog(true);
          }}
          className="flex items-center justify-center border-2 border-dashed border-doctor-deeporange text-doctor-deeporange h-32 rounded-lg cursor-pointer hover:bg-[--color-doctor-cream]">
          <span className="text-4xl font-bold">+</span>
        </div>
        {filtered.map((a) => (
          <div
            key={a.id}
            onClick={() => {
              setForm({ texte: a.texte, conditions: a.conditions || {} });
              setEditing(a);
              setOpenDialog(true);
            }}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md cursor-pointer">
            <p className="text-sm mb-2 text-doctor-deeporange">{a.texte}</p>
            <div className="text-xs text-gray-600">
              {Object.entries(a.conditions || {}).map(([key, val]) => (
                <div key={key}>
                  <strong>{key}:</strong> {val}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier l'accroche" : "Nouvelle accroche"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <textarea
              className="input w-full"
              placeholder="Texte de l'accroche"
              value={form.texte}
              onChange={(e) => setForm({ ...form, texte: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                className="input"
                value={form.conditions.imc}
                onChange={(e) =>
                  setForm({
                    ...form,
                    conditions: { ...form.conditions, imc: e.target.value },
                  })
                }>
                <option value="">IMC</option>
                <option value="maigre">Maigre</option>
                <option value="normal">Normal</option>
                <option value="surpoids">Surpoids</option>
                <option value="obese">Obèse</option>
              </select>
              <select
                className="input"
                value={form.conditions.sexe}
                onChange={(e) =>
                  setForm({
                    ...form,
                    conditions: { ...form.conditions, sexe: e.target.value },
                  })
                }>
                <option value="">Sexe</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
              <select
                className="input"
                value={form.conditions.calories}
                onChange={(e) =>
                  setForm({
                    ...form,
                    conditions: {
                      ...form.conditions,
                      calories: e.target.value,
                    },
                  })
                }>
                <option value="">Calories</option>
                <option value="bas">Bas</option>
                <option value="normal">Normal</option>
                <option value="élevé">Élevé</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-between">
            {editing && (
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            )}
            <Button onClick={handleSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
