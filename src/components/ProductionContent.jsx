import React, { useState, useEffect } from "react";
import Production from "./Production";
export const ProductionContent = ({ show }) => (
  <div className={`${show}`}>
    <h2 className="text-xl font-semibold text-doctor-deeporange mb-4">
      Planification de production
    </h2>
    {/* Implémentez votre logique de production ici */}
    <Production />
  </div>
);
