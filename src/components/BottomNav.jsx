import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, List, HeartPulse, Bot, User } from "lucide-react";
import { auth } from "../firebase";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const navItems = [
  { to: "/", label: "Accueil", icon: <Home size={20} /> },
  { to: "/commandes", label: "Commandes", icon: <List size={20} /> },
  { to: "/balance", label: "Balance", icon: <HeartPulse size={20} /> },
  { to: "/agent", label: "Agent IA", icon: <Bot size={20} /> },
  { to: "/login", label: "Profil", icon: <User size={20} /> },
];
import useUser from "../hooks/useUser";
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData, loading } = useUser();
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
    setOpen(false);
  };
  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-app border-t border-accent shadow-md">
      <div className="flex justify-around items-center h-14">
        {navItems.map(({ to, label, icon }) =>
          label != "Profil" ? (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive || location.pathname === to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`
              }>
              {icon}
              <span>{label}</span>
            </NavLink>
          ) : user ? (
            userData?.role != "admin" ? (
              <NavLink
                key={to}
                to={"/profil"}
                className={({ isActive }) =>
                  `flex flex-col items-center text-xs ${
                    isActive || location.pathname === to
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`
                }>
                {icon}
                <span>{"Profil"}</span>
              </NavLink>
            ) : (
              <>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      className={`flex flex-col items-center text-xs ${
                        location.pathname.startsWith("/admin")
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}>
                      <User size={20} />
                      <span>{"Admin"}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-app text-app text-center space-y-3">
                    <DialogHeader>
                      <DialogTitle className="text-primary">Admin</DialogTitle>
                    </DialogHeader>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full">
                      Panneau Admin
                    </Button>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        navigate("/profil");
                      }}
                      className="w-full">
                      Profil
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="w-full"
                      variant="outline">
                      Déconnexion
                    </Button>
                  </DialogContent>
                </Dialog>
              </>
            )
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive || location.pathname === to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`
              }>
              {icon}
              <span>{"Connexion"}</span>
            </NavLink>
          )
        )}
      </div>
    </footer>
  );
}
