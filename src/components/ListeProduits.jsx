import { useState } from "react";
import { ChevronDown } from "lucide-react"; // Icône de flèche

export default function ListeProduits({ produits }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <ul className="space-y-2">
      {(produits || []).map((prod, idx) => (
        <li key={idx} className="border border-doctor-orange rounded-md">
          <button
            onClick={() => toggle(idx)}
            className="w-full flex items-center justify-between px-4 py-2 bg-doctor-cream hover:bg-doctor-orange/30 font-semibold text-doctor-red rounded-t-md">
            {`Commande ${idx + 1}`}
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                openIndex === idx ? "rotate-180" : ""
              }`}
            />
          </button>

          {openIndex === idx && (
            <div className="px-4 py-3 bg-white text-sm rounded-b-md">
              <ul className="space-y-1 list-disc list-inside">
                {Object.entries(prod).map(([key, value], i) => (
                  <li key={i}>
                    <span className="font-medium capitalize">{key} :</span>{" "}
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
