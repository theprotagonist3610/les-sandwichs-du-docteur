// Composants de contenu pour chaque section (exemples simplifiés)
import React, { useState, useEffect } from "react";
import {
  Home,
  Boxes,
  Truck,
  Factory,
  ShoppingCart,
  Users,
  Utensils,
} from "lucide-react";

import { StatCard } from "./StatCard";
export const AccueilContent = ({ show }) => (
  <div
    className={`${show} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
    <StatCard
      title="Ventes du jour"
      value="1,240 FCFA"
      icon={<ShoppingCart className="text-doctor-red" />}
    />
    <StatCard
      title="Menus disponibles"
      value="12"
      icon={<Utensils className="text-doctor-orange" />}
    />
    <StatCard
      title="Nouveaux clients"
      value="5"
      icon={<Users className="text-doctor-deeporange" />}
    />
  </div>
);
