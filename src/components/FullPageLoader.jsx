import { useEffect, useState } from "react";

const accroches = [
  "🥦 Le brocoli consulte le stéthoscope...",
  "🥕 Le Docteur mixe la sauce secrète...",
  "🍅 Le sandwich passe une radio nutritionnelle...",
  "🥬 Calcul de la balance alimentaire...",
  "🧄 Le Docteur remue les épices en pensant à vous...",
  "🥒 Chargement de vitamines en cours...",
];

export default function FullPageLoader() {
  const veggies = ["🥕", "🍅", "🥬", "🧄", "🥦", "🥒"];
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const html = document.documentElement;
    setDarkMode(html.classList.contains("theme-sombre"));

    const random = Math.floor(Math.random() * accroches.length);
    setMessage(accroches[random]);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-4 text-app bg-app`}>
      <div className="relative w-48 h-48 mb-6">
        {/* Logo central */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className={`w-20 h-20 rounded shadow-lg p-2 ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}>
            <img
              src="/les-sandwichs-du-docteur.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Légumes qui tournent */}
        <div className="absolute inset-0 animate-spin-smooth [animation-duration:5s]">
          {veggies.map((veg, i) => {
            const angle = (i / veggies.length) * 360;
            const radius = 80;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);
            return (
              <div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `calc(50% + ${x}px - 0.75rem)`,
                  top: `calc(50% + ${y}px - 0.75rem)`,
                }}>
                {veg}
              </div>
            );
          })}
        </div>
      </div>

      {/* Message d'accroche */}
      <p className="text-sm text-muted-foreground max-w-xs italic">{message}</p>
    </div>
  );
}
