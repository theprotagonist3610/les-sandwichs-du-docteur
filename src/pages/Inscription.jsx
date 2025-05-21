import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import Navbar from "../components/Navbar";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../components/ui/select.js";

const Inscription = () => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState("");
  const [role, setRole] = useState("client");
  const navigate = useNavigate();

  const validerMotDePasse = () => {
    if (motDePasse.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (motDePasse !== confirmation) {
      return "Les mots de passe ne correspondent pas.";
    }
    return null;
  };

  const handleInscription = async (e) => {
    e.preventDefault();
    setErreur("");

    const erreurValidation = validerMotDePasse();
    if (erreurValidation) {
      setErreur(erreurValidation);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        motDePasse
      );
      const user = userCredential.user;

      await setDoc(doc(db, "utilisateurs", user.uid), {
        nom,
        prenom,
        email,
        role,
        sexe,
        uid: user.uid,
        createdAt: new Date(),
      });

      navigate("/");
    } catch (error) {
      setErreur(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-doctor-cream text-doctor-red">
      {/* Navbar en haut */}
      <Navbar />

      {/* Contenu de la page */}
      <main className="text-center py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Créer un compte
            </h2>
            <form onSubmit={handleInscription} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  className="w-full p-3 border rounded-xl"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Nom"
                  className="w-full p-3 border rounded-xl"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex items-center gap-4 mb-4"></div>
              <Select onValueChange={setSexe} value={sexe}>
                <SelectTrigger>
                  <SelectValue placeholder={"Votre sexe"}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homme">{"Homme"}</SelectItem>
                  <SelectItem value="Femme">{"Femme"}</SelectItem>
                  <SelectItem value="Inconnu">{"Inconnu"}</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full p-3 border rounded-xl"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirmez le mot de passe"
                className="w-full p-3 border rounded-xl"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />

              <select
                className="w-full p-3 border rounded-xl bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}>
                <option value="client">Client</option>
              </select>

              <button
                type="submit"
                className="w-full bg-doctor-orange hover:bg-doctor-deeporange hover:text-white text-white p-3 rounded-xl hover:bg-blue-700 transition">
                S'inscrire
              </button>
              {erreur && (
                <p className="text-red-500 text-sm text-center">{erreur}</p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inscription;
