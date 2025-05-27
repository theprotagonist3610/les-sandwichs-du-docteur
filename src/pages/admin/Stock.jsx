import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddElement from "../../components/AddElement";

const TYPE_LABELS = {
  ingredients: "Ingrédients",
  ustensiles: "Ustensiles",
  utilitaires: "Utilitaires",
  recettes: "Recettes disponibles",
};

export default function StockAdmin() {
  const [groupedStock, setGroupedStock] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "stock"), (snapshot) => {
      const stock = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const grouped = stock.reduce((acc, item) => {
        const type = item.type || "autres";
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
      }, {});
      setGroupedStock(grouped);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {Object.entries(groupedStock).map(([type, items]) => (
        <div key={type} className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-app">
            {TYPE_LABELS[type] || type}
          </h2>
          <div className="overflow-x-auto border rounded-md bg-white shadow">
            <Table>
              <TableHeader className="bg-muted text-muted-foreground">
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Qte disp.</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead>Niveau</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-accent/30 transition">
                    <TableCell className="font-medium text-app">
                      {item.nom || item.name || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{item.qte || 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      —
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      —
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}

      <AddElement />
    </div>
  );
}
