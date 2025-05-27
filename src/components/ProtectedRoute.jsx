import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(null); // null = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthorized(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const role = userSnap.data()?.role;

        setAuthorized(role === "admin");
      } catch (error) {
        console.error("Erreur de vérification du rôle :", error);
        setAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (authorized === null) {
    return (
      <div className="p-4 text-sm">⏳ Vérification des accès admin...</div>
    );
  }

  return authorized ? children : <Navigate to="/" replace />;
}
