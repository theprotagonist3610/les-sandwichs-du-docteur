import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    profession: "",
    activitePhysique: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        ...form,
        role: "client",
        createdAt: serverTimestamp(),
      });

      toast.success("Bienvenue chez Les Sandwichs du Docteur !");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création du compte.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md md:max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="py-1">Nom</Label>
                <Input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="py-1">Prénom</Label>
                <Input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="py-1">Sexe</Label>
                <Select onValueChange={(v) => setForm({ ...form, sexe: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez le sexe" />
                  </SelectTrigger>
                  <SelectContent className="bg-app text-app">
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="py-1">Date de naissance</Label>
                <Input
                  type="date"
                  name="dateNaissance"
                  value={form.dateNaissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="py-1">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="py-1">Téléphone</Label>
                <Input
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="py-1">Profession</Label>
                <Input
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="py-1">Mot de passe</Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="py-1">Niveau d'activité physique</Label>
              <Select
                onValueChange={(v) =>
                  setForm({ ...form, activitePhysique: v })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
                <SelectContent className="bg-app text-app">
                  <SelectItem value="faible">Faible</SelectItem>
                  <SelectItem value="moderee">Modérée</SelectItem>
                  <SelectItem value="elevee">Élevée</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs mt-1 text-muted-foreground">
                <strong>Faible</strong> : activité physique très occasionnelle.
                <br />
                <strong>Modérée</strong> : marche régulière, tâches ménagères.
                <br />
                <strong>Élevée</strong> : sport quotidien ou travail physique.
              </p>
            </div>
            <Button type="submit" className="w-full">
              Créer mon compte
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
