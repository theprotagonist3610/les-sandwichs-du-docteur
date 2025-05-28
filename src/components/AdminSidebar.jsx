import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
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
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
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

export default function AdminSidebar({ open, onClose }) {
  const linkClass =
    "text-sm font-medium px-3 py-2 rounded flex items-center gap-2 transition hover:underline underline-offset-4";

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 bg-app">
        <div className="py-6 flex flex-col gap-4">
          {routes.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-app"
                }`
              }>
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
          <NavLink
            to={"/"}
            onClick={onClose}
            className={`${linkClass} bg-app text-app`}>
            <span>
              <X size={16} />
            </span>
            <span>{"Fermer Admin"}</span>
          </NavLink>
          <NavLink
            to={"/"}
            onClick={async () => {
              await signOut(auth);
              onClose();
            }}
            className={`${linkClass} bg-app text-app`}>
            <span>
              <LogOut size={16} />
            </span>
            <span>{"Deconnexion"}</span>
          </NavLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
