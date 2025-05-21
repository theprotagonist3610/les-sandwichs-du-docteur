import React, { useState, useEffect } from "react";
import { GestionStock } from "./GestionStock";
import { Price } from "../price_calculator";
export const StocksContent = ({ show }) => (
  <div className={`${show}`}>
    {/* Implémentez votre logique de gestion des stocks ici */}
    <GestionStock></GestionStock>
  </div>
);
