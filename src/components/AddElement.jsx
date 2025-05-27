import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const types = ["ingredients", "ustensiles", "utilitaires", "recettes"];

export default function AddElement() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nom: "", type: "ingredients" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "stock"), {
        nom: form.nom,
        type: form.type,
        operations: [],
        standard: 0,
      });
      toast.success("Nouvel élément ajouté");
      setForm({ nom: "", type: "ingredients" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 text-white text-xl bg-primary shadow-lg">
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 bg-app text-app">
        <h2 className="text-lg font-semibold">Ajouter un élément</h2>
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input name="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent className="bg-app text-app">
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Ajouter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
