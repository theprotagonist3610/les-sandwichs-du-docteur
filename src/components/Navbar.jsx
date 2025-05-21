// src/components/Navbar.jsx
import logo from "/Les sandwichs.png"; // remplace par le chemin réel si différent
import { useUser } from "../UserContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { usePanier } from "../PanierContext";
import { ShoppingCart } from "lucide-react"; // ou un autre icône de panier
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { utilisateur, setUtilisateur } = useUser();
  const navigate = useNavigate();
  const { commandes } = usePanier();
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUtilisateur(null);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="bg-doctor-cream shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
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

            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </Link>
          </div>

          {/* Panier mobile centré */}
          {utilisateur?.role && (
            <div className="absolute m-4 top-2 left-1/2 transform -translate-x-1/2 md:hidden">
              <Link to="/commandes" className="relative">
                <ShoppingCart className="w-7 h-7 text-doctor-red" />
                {commandes.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-doctor-red text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {commandes.length}
                  </span>
                )}
              </Link>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-6">
            {utilisateur?.role && <NavLink to="/" text="Accueil" />}
            {utilisateur?.role && <NavLink to="/commandes" text="Commandes" />}
            {utilisateur?.role === "admin" && (
              <NavLink to={`/admin/${utilisateur.uid}`} text="Admin" />
            )}
            {utilisateur?.role && (
              <Link to="/commandes" className="relative">
                <ShoppingCart className="w-6 h-6 text-doctor-red" />
                {commandes.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-doctor-red text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {commandes.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {utilisateur ? (
              <>
                <span className="text-doctor-red font-semibold">
                  Bonjour, {utilisateur.prenom}
                </span>
                <Link
                  to="/compte"
                  className="px-4 py-2 border border-doctor-red text-doctor-red rounded hover:bg-doctor-orange hover:text-white">
                  Mon compte
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-doctor-red text-white rounded hover:bg-doctor-deeporange">
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <ButtonLink to="/inscription" variant="outline">
                  S'inscrire
                </ButtonLink>
                <ButtonLink to="/connexion" variant="solid">
                  Se connecter
                </ButtonLink>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {utilisateur ? (
              <button onClick={handleLogout} className="text-doctor-red p-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-doctor-cream pb-4 px-4">
          <div className="flex flex-col space-y-3">
            {utilisateur?.role && (
              <MobileNavLink
                to="/"
                text="Accueil"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
            {utilisateur?.role && (
              <MobileNavLink
                to="/commandes"
                text="Commandes"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
            {utilisateur?.role === "admin" && (
              <MobileNavLink
                to={`/admin/${utilisateur.uid}`}
                text="Admin"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
            {utilisateur ? (
              <>
                <MobileNavLink
                  to="/compte"
                  text="Mon compte"
                  onClick={() => setIsMenuOpen(false)}
                />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-left py-2 px-4 text-doctor-red hover:bg-doctor-orange hover:text-white rounded">
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

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

// // src/components/Navbar.jsx
// // import React from "react";
// import logo from "/Les sandwichs.png"; // remplace par le chemin réel si différent
// import { useUser } from "../UserContext";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { utilisateur } = useUser();
//   return (
//     <nav className="bg-doctor-cream shadow-md">
//       {/* Conteneur principal */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-20 items-center">
//           {/* Logo + Hamburger (mobile) */}
//           <div className="flex items-center">
//             {/* Bouton Hamburger (mobile only) */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden text-doctor-red focus:outline-none"
//               aria-label="Menu">
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor">
//                 {isMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>

//             {/* Logo */}
//             <Link to="/" className="flex-shrink-0 flex items-center">
//               <img
//                 src={logo}
//                 alt="Logo"
//                 className="w-24 h-24 md:w-32 md:h-32 object-contain"
//               />
//             </Link>
//           </div>

//           {/* Navigation (desktop) */}
//           <div className="hidden md:flex items-center space-x-6">
//             <NavLink to="/" text="Accueil" />
//             <NavLink to="/commandes" text="Commandes" />
//             <NavLink to="/admin" text="Admin" />
//           </div>

//           {/* Boutons (desktop) */}
//           <div className="hidden md:flex items-center space-x-4">
//             <ButtonLink to="/inscription" variant="outline">
//               S'inscrire
//             </ButtonLink>
//             <ButtonLink to="/connexion" variant="solid">
//               Se connecter
//             </ButtonLink>
//           </div>

//           {/* Boutons (mobile - à côté du logo) */}
//           <div className="md:hidden flex items-center space-x-2">
//             <button className="text-doctor-red p-2">
//               <Link to="/connexion">
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//               </Link>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Menu mobile */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-doctor-cream pb-4 px-4">
//           <div className="flex flex-col space-y-3">
//             <MobileNavLink
//               to="/"
//               text="Accueil"
//               onClick={() => setIsMenuOpen(false)}
//             />
//             <MobileNavLink
//               to="/commandes"
//               text="Commandes"
//               onClick={() => setIsMenuOpen(false)}
//             />
//             <MobileNavLink
//               to="/admin"
//               text="Admin"
//               onClick={() => setIsMenuOpen(false)}
//             />

//             <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
//               <MobileButtonLink
//                 to="/inscription"
//                 onClick={() => setIsMenuOpen(false)}>
//                 S'inscrire
//               </MobileButtonLink>
//               <MobileButtonLink
//                 to="/connexion"
//                 primary
//                 onClick={() => setIsMenuOpen(false)}>
//                 Se connecter
//               </MobileButtonLink>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// // Composants réutilisables
// const NavLink = ({ to, text }) => (
//   <Link
//     to={to}
//     className="text-doctor-red font-medium hover:text-doctor-deeporange transition-colors">
//     {text}
//   </Link>
// );

// const MobileNavLink = ({ to, text, onClick }) => (
//   <Link
//     to={to}
//     onClick={onClick}
//     className="block py-2 text-doctor-red font-medium hover:text-doctor-deeporange">
//     {text}
//   </Link>
// );

// const ButtonLink = ({ to, variant = "outline", children }) => (
//   <Link
//     to={to}
//     className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
//       variant === "outline"
//         ? "border border-doctor-red text-doctor-red hover:bg-doctor-orange hover:text-white"
//         : "bg-doctor-red text-white hover:bg-doctor-deeporange"
//     }`}>
//     {children}
//   </Link>
// );

// const MobileButtonLink = ({ to, primary = false, onClick, children }) => (
//   <Link
//     to={to}
//     onClick={onClick}
//     className={`block w-full text-center py-2 px-4 rounded font-medium ${
//       primary
//         ? "bg-doctor-red text-white hover:bg-doctor-deeporange"
//         : "border border-doctor-red text-doctor-red hover:bg-doctor-orange hover:text-white"
//     }`}>
//     {children}
//   </Link>
// );

// export default Navbar;
