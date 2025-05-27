import { useFullLoader } from "../context/FullLoaderContext";
import { useEffect } from "react";
export default function Home() {
  const { show, hide } = useFullLoader();
  useEffect(() => {
    show();
    setTimeout(() => hide(), 5000);
  }, []);
  return (
    <div className="bg-app text-app min-h-screen flex flex-col">
      {/* Contenu principal */}
      <main className="flex-1 px-4 py-8 flex flex-col items-center justify-start text-center">
        <h1 className="text-2xl font-extrabold mb-4 leading-tight">
          Réconcilie ton corps <br /> avec ton estomac 💪
        </h1>

        <p className="text-sm text-app mb-6">
          Des sandwichs savoureux, équilibrés <br /> et approuvés par le Docteur
          lui-même.
        </p>

        <button className="btn-primary text-white text-sm rounded-full px-6 py-3 shadow-md hover:opacity-90 transition">
          Commander un sandwich 🍞
        </button>
      </main>

      {/* Footer simple */}
      <footer className="text-xs text-center py-4 text-app opacity-60">
        © 2025 Les Sandwichs du Docteur
      </footer>
    </div>
  );
}
