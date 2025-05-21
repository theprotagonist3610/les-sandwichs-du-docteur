import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export default function FloatingNotifier({ onClick }) {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showMessage ? (
        <div className="bg-doctor-orange text-white px-4 py-3 rounded-full shadow-lg animate-fade-in-out">
          Mettre à jour vos données anthropométriques
        </div>
      ) : (
        <button
          onClick={onClick}
          className="bg-doctor-deeporange hover:bg-doctor-orange text-white p-4 rounded-full shadow-xl transition-all duration-300">
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
