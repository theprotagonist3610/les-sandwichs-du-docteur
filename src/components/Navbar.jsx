// src/components/Navbar.jsx
// import React from "react";
import logo from "/Les sandwichs.png"; // remplace par le chemin réel si différent
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav className="h-20 bg-doctor-cream flex items-center justify-between px-6 shadow-md">
//       {/* Logo à gauche */}
//       <div className="flex items-center space-x-3">
//         <img
//           src={logo}
//           alt="Logo"
//           className="w-[200px] h-[200px] object-contain"
//         />
//         {/* <img src={logo} alt="Logo" className="h-12 w-auto" /> */}
//       </div>

//       {/* Onglets de navigation */}
//       <div className="flex items-center space-x-6">
//         <Link
//           to="/"
//           className="text-doctor-red font-medium hover:text-doctor-deeporange">
//           Accueil
//         </Link>
//         <Link
//           to="/commandes"
//           className="text-doctor-red font-medium hover:text-doctor-deeporange">
//           Commandes
//         </Link>
//         <Link
//           to="/admin"
//           className="text-doctor-red font-medium hover:text-doctor-deeporange">
//           Admin
//         </Link>
//       </div>

//       {/* Boutons à droite */}
//       <div className="flex items-center space-x-4">
//         <button className="border border-doctor-red text-doctor-red px-4 py-1 rounded hover:bg-doctor-orange hover:text-white">
//           <Link to="/inscription">S'inscrire</Link>
//         </button>
//         <button className="bg-doctor-red text-white px-4 py-1 rounded hover:bg-doctor-deeporange">
//           <Link to="/connexion">Se connecter</Link>
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-doctor-cream shadow-md">
      {/* Conteneur principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo + Hamburger (mobile) */}
          <div className="flex items-center">
            {/* Bouton Hamburger (mobile only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-doctor-red focus:outline-none"
              aria-label="Menu">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </Link>
          </div>

          {/* Navigation (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" text="Accueil" />
            <NavLink to="/commandes" text="Commandes" />
            <NavLink to="/admin" text="Admin" />
          </div>

          {/* Boutons (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <ButtonLink to="/inscription" variant="outline">
              S'inscrire
            </ButtonLink>
            <ButtonLink to="/connexion" variant="solid">
              Se connecter
            </ButtonLink>
          </div>

          {/* Boutons (mobile - à côté du logo) */}
          <div className="md:hidden flex items-center space-x-2">
            <button className="text-doctor-red p-2">
              <Link to="/connexion">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-doctor-cream pb-4 px-4">
          <div className="flex flex-col space-y-3">
            <MobileNavLink
              to="/"
              text="Accueil"
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavLink
              to="/commandes"
              text="Commandes"
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavLink
              to="/admin"
              text="Admin"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
              <MobileButtonLink
                to="/inscription"
                onClick={() => setIsMenuOpen(false)}>
                S'inscrire
              </MobileButtonLink>
              <MobileButtonLink
                to="/connexion"
                primary
                onClick={() => setIsMenuOpen(false)}>
                Se connecter
              </MobileButtonLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Composants réutilisables
const NavLink = ({ to, text }) => (
  <Link
    to={to}
    className="text-doctor-red font-medium hover:text-doctor-deeporange transition-colors">
    {text}
  </Link>
);

const MobileNavLink = ({ to, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block py-2 text-doctor-red font-medium hover:text-doctor-deeporange">
    {text}
  </Link>
);

const ButtonLink = ({ to, variant = "outline", children }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
      variant === "outline"
        ? "border border-doctor-red text-doctor-red hover:bg-doctor-orange hover:text-white"
        : "bg-doctor-red text-white hover:bg-doctor-deeporange"
    }`}>
    {children}
  </Link>
);

const MobileButtonLink = ({ to, primary = false, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block w-full text-center py-2 px-4 rounded font-medium ${
      primary
        ? "bg-doctor-red text-white hover:bg-doctor-deeporange"
        : "border border-doctor-red text-doctor-red hover:bg-doctor-orange hover:text-white"
    }`}>
    {children}
  </Link>
);

export default Navbar;
