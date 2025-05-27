import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Accueil", icon: "🏠" },
  { to: "/commandes", label: "Commandes", icon: "🧺" },
  { to: "/balance", label: "Balance", icon: "⚖️" },
  { to: "/agent", label: "Agent IA", icon: "🤖" },
  { to: "/admin", label: "Admin", icon: "🔒" },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-app border-t border-accent shadow z-50">
      <div className="flex justify-around text-sm text-app">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 w-full ${
                isActive ? "text-primary font-bold" : "opacity-70"
              }`
            }>
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
