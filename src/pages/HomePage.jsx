import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../UserContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { MenuDuJour } from "../components/MenuDuJour";
import { AutresMenus } from "../components/AutresMenus";
const getNumeroOrdre = async () => {
  const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
  const docRef = doc(db, "numero_ordre", "ordre");
  const docSnap = await getDoc(docRef);
  let res = 0;
  if (!docSnap.exists()) {
    // Si le document n'existe pas encore
    await setDoc(docRef, {
      date: today,
      numero: 1,
    });
    res = 1;
  } else {
    const data = docSnap.data();

    if (data.date !== today) {
      // Réinitialiser si la date a changé
      await updateDoc(docRef, {
        date: today,
        numero: 1,
      });
      res = 1;
    } else {
      const newNumero = data.numero + 1;
      await updateDoc(docRef, {
        numero: newNumero,
      });
      res = newNumero;
    }
  }
  return (() => {
    if (res <= 9) {
      return `0000${res}`;
    } else if (res <= 99) {
      return `000${res}`;
    } else if (res <= 999) {
      return `0${res}`;
    } else {
      return `${res}`;
    }
  })();
};
const HomePage = () => {
  const { utilisateur } = useUser();
  const navigate = useNavigate();
  const codecommande = (infos) => {
    const now = new Date();
    const jour = now.getDate().toString().padStart(2, "0");
    const mois = (now.getMonth() + 1).toString().padStart(2, "0");
    const annee = now.getFullYear();
    const sexe = infos?.sexe === "Homme" ? "H" : "F";
    return `${jour}${mois}${annee}${sexe}${infos?.numero_dordre}-${infos?.type?.[0]}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-doctor-red flex flex-col">
      <Navbar />
      <main className="flex-1 mt-24 text-center py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {utilisateur ? `${utilisateur.prenom}, ` : ""}
          Bienvenue chez Les Sandwichs du Docteur
        </h1>
        <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto">
          Des sandwichs généreux, préparés avec amour et livrés chez vous.
        </p>
        {/*Menu du jour tjrs annonce change en fonction de ce qui est disponible et des jours*/}
        <MenuDuJour />
        <AutresMenus />
      </main>
    </div>
  );
};

export default HomePage;
