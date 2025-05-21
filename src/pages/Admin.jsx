import React from "react";
import Navbar from "../components/Navbar";
import { DashboardAdmin } from "../components/DashboardAdmin.jsx";
const Admin = () => {
  return (
    <div className="min-h-screen bg-doctor-cream text-doctor-red">
      {/* Navbar en haut */}
      <Navbar />
      {/* Contenu de la page */}
      <main className="text-center py-20">
        <DashboardAdmin></DashboardAdmin>
      </main>
    </div>
  );
};

export default Admin;
