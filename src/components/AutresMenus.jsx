// components/AutresMenus.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const AutresMenus = () => {
  const [menus, setMenus] = useState([]);
  const [superMenus, setSuperMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [menusSnap, superMenusSnap] = await Promise.all([
          getDocs(collection(db, "menus")),
          getDocs(collection(db, "supermenus")),
        ]);

        setMenus(menusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setSuperMenus(
          superMenusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Erreur chargement des menus :", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Nos autres menus</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[...menus, ...superMenus].map((menu) => (
          <div key={menu.id} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold">{menu.nom}</h3>
            <p className="text-sm">{menu.description}</p>
            <p className="text-doctor-red font-bold">{menu.prix} FCFA</p>
          </div>
        ))}
      </div>
    </div>
  );
};
