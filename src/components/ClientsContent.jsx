import React, { useState, useEffect } from "react";
export const ClientsContent = ({ show }) => (
  <div className={`${show}`}>
    <h2 className="text-xl font-semibold text-doctor-deeporange mb-4">
      Liste des clients
    </h2>
    {/* Implémentez votre logique clients ici */}
  </div>
);
