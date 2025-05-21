import React, { useState, useEffect } from "react";
export const StatCard = ({ title, value, icon }) => (
  <div className="bg-doctor-cream/50 border border-doctor-orange/20 rounded-lg p-4 flex items-center">
    <div className="p-3 bg-white rounded-full shadow-sm mr-4">{icon}</div>
    <div>
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-xl font-bold text-doctor-deeporange">{value}</p>
    </div>
  </div>
);
