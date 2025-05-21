import React, { useState } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Commandes from "./pages/Commandes";
import Admin from "./pages/Admin";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import { Toaster, toast } from "sonner";
import { useUser } from "./UserContext";
import { Outlet } from "react-router-dom";
import FloatingNotifier from "./components/FloatingNotifier";
import UserConstantesDialog from "./components/UserConstantesDialog";
const ProtectedAdminRoute = () => {
  const { utilisateur } = useUser();
  const { id } = useParams();
  // Vérifier si l'ID existe et est valide (ajoutez votre propre logique de validation)
  const isValidId = (id) => {
    // Exemple de validation - à adapter selon vos besoins
    return id && utilisateur && id === utilisateur?.uid; // Supposons que vos IDs font 24 caractères
  };

  if (!isValidId(id)) {
    // Rediriger vers la page de login si l'ID est invalide
    toast.error("Accès non autorisé - ID admin requis");
    return <Navigate to="/connexion" replace />;
  }

  // Si l'ID est valide, afficher le dashboard admin
  return <Admin adminId={id} />;
};

function App() {
  const { utilisateur } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/admin/:id" element={<ProtectedAdminRoute />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/Connexion" element={<Connexion />} />
      </Routes>
      {utilisateur && (
        <div className="relative">
          <Outlet />

          <FloatingNotifier onClick={() => setOpenDialog(true)} />

          <UserConstantesDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />
        </div>
      )}
    </>
  );
}

export default App;
