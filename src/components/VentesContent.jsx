import React, { useState, useEffect } from "react";
export const VentesContent = ({ show }) => (
  <div className={`${show}`}>
    <h2 className="text-xl font-semibold text-doctor-deeporange mb-4">
      Statistiques de vente
    </h2>
    {/* Implémentez votre logique de ventes ici */}
  </div>
);
