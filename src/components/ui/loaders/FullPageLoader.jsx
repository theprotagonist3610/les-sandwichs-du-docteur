import { useEffect, useState } from "react";

export default function FullPageLoader() {
  const veggies = ["🥕", "🍅", "🥬", "🧄"];
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setDarkMode(html.classList.contains("theme-sombre"));
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? "bg-black/80" : "bg-app bg-opacity-80"
      }`}>
      <div className="relative w-48 h-48">
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
    </div>
  );
}
