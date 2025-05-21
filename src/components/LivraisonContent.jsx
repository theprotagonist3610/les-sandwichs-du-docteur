import React, { useState, useEffect } from "react";
import { GestionLivraison } from "./GestionLivraison";
export const LivraisonContent = ({ show }) => (
  <div className={`${show}`}>
    {/* Implémentez votre logique de gestion des livraisons ici */}
    <GestionLivraison></GestionLivraison>
  </div>
);
