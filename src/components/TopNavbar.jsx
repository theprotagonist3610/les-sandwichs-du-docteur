import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/commandes", label: "Commandes" },
  { to: "/balance", label: "Balance" },
  { to: "/agent", label: "Agent IA" },
  { to: "/admin", label: "Admin" },
];

export default function TopNavbar() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        const data = userDoc.data();
        if (data?.prenom && data?.nom) {
          setUserName(`${data.prenom} ${data.nom[0]}.`);
        } else {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Déconnecté avec succès !");
    navigate("/");
  };

  const linkClass =
    "text-sm font-medium px-4 py-2 rounded hover:text-primary transition";

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-app border-b border-accent shadow">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold text-primary flex items-center gap-2">
          🥪 <span>Les Sandwichs du Docteur</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 items-center">
          {navItems.map(({ to, label }) =>
            label != "Admin" ? (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive ? "text-primary font-bold" : "text-app"
                  }`
                }>
                {label}
              </NavLink>
            ) : (
              user && (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `${linkClass} ${
                      isActive ? "text-primary font-bold" : "text-app"
                    }`
                  }>
                  {label}
                </NavLink>
              )
            )
          )}
        </nav>

        {/* Actions (Theme + user) */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <NavLink to={"/profil"}>
                <span className="text-sm font-medium text-app">
                  👤 {userName}
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline">
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 text-sm rounded hover:opacity-90 hover:underline">
              Connexion
            </Link>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
