import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const SwitchMenuDuJour = () => {
  const [menuDuJour, setMenuDuJour] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [menus, setMenus] = useState([]);
  const [supermenus, setSupermenus] = useState([]);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    const fetchCurrentMenu = async () => {
      const snapshot = await getDocs(collection(db, "menudujour"));
      if (!snapshot.empty) {
        setMenuDuJour(snapshot.docs[0].data());
      }
    };
    fetchCurrentMenu();
  }, []);

  const openDialog = async () => {
    setShowDialog(true);
    const [menusSnap, supermenusSnap] = await Promise.all([
      getDocs(collection(db, "menus")),
      getDocs(collection(db, "supermenus")),
    ]);
    setMenus(menusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setSupermenus(
      supermenusSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const handleConfirm = async () => {
    const ref = doc(db, "menudujour", "menu"); // 1 seul doc
    await setDoc(ref, selection);
    setMenuDuJour(selection);
    setShowDialog(false);
  };

  return (
    <div className="px-4 py-1 bg-white border border-gray-200 rounded-xl shadow flex items-center justify-between">
      <div>
        <h2 className="text-md font-bold text-doctor-red mb-2">Menu du Jour</h2>
        {menuDuJour ? (
          <div className="">
            <h3 className="text-xs font-semibold">{menuDuJour.nom}</h3>
          </div>
        ) : (
          <p className="text-xs text-gray-500 mb-4">
            Aucun menu du jour défini.
          </p>
        )}
      </div>
      <div>
        <button
          onClick={openDialog}
          className="bg-doctor-red text-xs text-white font-semibold p-1 rounded hover:bg-doctor-deeporange">
          Changer
        </button>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Choisir un nouveau menu</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...menus, ...supermenus].map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => setSelection(menu)}
                  className={`cursor-pointer border rounded-lg p-4 ${
                    selection?.id === menu.id
                      ? "bg-green-100 border-green-500"
                      : "hover:bg-gray-100"
                  }`}>
                  <h4 className="font-semibold">{menu.nom}</h4>
                  <p className="text-sm text-gray-600">{menu.description}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                Annuler
              </button>
              <button
                disabled={!selection}
                onClick={handleConfirm}
                className="px-4 py-2 bg-doctor-red text-white rounded hover:bg-doctor-deeporange disabled:opacity-50">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwitchMenuDuJour;
