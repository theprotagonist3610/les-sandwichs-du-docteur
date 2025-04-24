import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Commandes from "./pages/Commandes";
import Admin from "./pages/Admin";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/commandes" element={<Commandes />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/Connexion" element={<Connexion />} />
    </Routes>
  );
}

export default App;
