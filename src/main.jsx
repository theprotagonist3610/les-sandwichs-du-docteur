// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext.jsx";
import { PanierProvider } from "./PanierContext.jsx";
import App from "./App.jsx";
import "./index.css"; // Fichier TailwindCSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PanierProvider>
          <App />
        </PanierProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
