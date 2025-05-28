import { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Box,
  Users,
  Gift,
  Bot,
  Wallet,
  BarChart3,
  X,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
const routes = [
  { to: "/admin", label: "Accueil", icon: <LayoutDashboard size={16} /> },
  { to: "/admin/production", label: "Production", icon: <Package size={16} /> },
  { to: "/admin/stock", label: "Stock", icon: <Box size={16} /> },
  { to: "/admin/clients", label: "Clients", icon: <Users size={16} /> },
  { to: "/admin/promotions", label: "Promotions", icon: <Gift size={16} /> },
  { to: "/admin/agent", label: "Agent IA", icon: <Bot size={16} /> },
  { to: "/admin/compta", label: "Comptabilité", icon: <Wallet size={16} /> },
  { to: "/admin/stats", label: "Statistiques", icon: <BarChart3 size={16} /> },
];

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, userData, loading } = useUser();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/stock");
  };
  const linkClass =
    "text-sm font-medium px-3 py-2 rounded transition flex items-center gap-1 hover:underline underline-offset-4";

  return (
    <>
      <header className="sticky top-0 z-40 bg-app border-b border-accent shadow-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
          {/* Gauche : Logo + bouton hamburger */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-2xl"
              onClick={() => setOpen(true)}
              aria-label="Menu">
              ☰
            </button>
            <h1 className="text-lg font-bold text-primary">Panneau Admin</h1>
          </div>

          {/* Centre : liens admin sur desktop */}
          <nav className="hidden md:flex gap-4">
            {routes.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `${linkClass} ${
                    isActive ? "bg-primary text-white shadow-sm" : "text-app"
                  }`
                }>
                <span>{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          {/* Droite : dropdown admin */}
          <div className="relative hidden md:inline">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-muted-foreground cursor-pointer">
                {userData
                  ? `${userData.prenom} ${userData.nom[0]}.👨‍⚕️`
                  : `Bienvenue 👨‍⚕️`}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-app text-app z-50">
                <DropdownMenuItem onClick={() => navigate("/")}>
                  {" "}
                  <X size={14} className="mr-2" /> Fermer Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  {" "}
                  <LogOut size={14} className="mr-2" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar mobile */}
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
