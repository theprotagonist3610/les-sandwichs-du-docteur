import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useUser } from "../UserContext.jsx";

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const { setUtilisateur } = useUser();
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        motDePasse
      );
      const user = userCredential.user;

      const docRef = doc(db, "utilisateurs", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUtilisateur({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          role: data.role,
          sexe: data.sexe,
          uid: data.uid,
          constantes: data.constantes,
        });
        navigate("/");
      } else {
        setErreur("Données utilisateur introuvables.");
      }
    } catch (error) {
      setErreur("Identifiants incorrects ou compte inexistant.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-doctor-cream text-doctor-red">
      {/* Navbar en haut */}
      <Navbar />

      {/* Contenu de la page */}
      <main className="text-center py-20">
        <div className="min-h-screen flex items-center justify-center px-4 bg-doctor-cream">
          <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Connexion
            </h2>

            <form onSubmit={handleConnexion} className="space-y-5">
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-doctor-red"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-doctor-red"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-doctor-orange text-white p-3 rounded-xl font-semibold hover:bg-doctor-deeporange transition flex justify-center items-center"
                disabled={chargement}>
                {chargement ? (
                  <motion.div
                    className="h-5 w-5 border-4 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                  />
                ) : (
                  "Se connecter"
                )}
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

export default Connexion;
