import { useState, useEffect } from "react";
import { db } from "../firebase";
import { groupBy } from "lodash";
import {
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Toaster, toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu"; // ou ton chemin
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
export const GestionStock = () => {
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [operations, setOperations] = useState([]);
  const [operation, setOperation] = useState({
    action: "achat", // ou production, perte
    quantite: 0,
    date: new Date().toISOString().slice(0, 10),
  });
  const [currentProduct, setCurrentProduct] = useState({
    nom: "",
    type: "matériel",
    unite: "",
    symbole: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("tous");
  const [groupedData, setGroupedData] = useState([]);
  //Enregistrer des operations
  const saveOperation = async () => {
    if (!operation.quantite || isNaN(operation.quantite)) {
      toast.error("Quantité invalide.");
      return;
    }
    try {
      await addDoc(collection(db, selectedProduct.id), {
        ...operation,
        quantite: Number(operation.quantite),
        createdAt: new Date(),
      });
      toast.success("Opération ajoutée");
      setOperationDialogOpen(false);
      setOperation({
        action: "achat",
        quantite: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      toast.error(`Erreur: ${err.message}`);
      console.log(err.message);
    }
  };

  //Charger les operations
  const fetchOperations = async (productId) => {
    try {
      const snapshot = await getDocs(collection(db, productId));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setOperations(sorted);

      // mise à jour du graphique
      setGroupedData(groupOperationsByDate(sorted));
    } catch (err) {
      toast.error("Erreur lors du chargement des opérations");
      console.log(err.message);
    }
  };
  //grouper les operations par date
  const groupOperationsByDate = (ops) => {
    const grouped = {};

    ops.forEach((op) => {
      const date = op.date;
      if (!grouped[date]) {
        grouped[date] = { date, achat: 0, production: 0, perte: 0 };
      }
      grouped[date][op.action] += op.qte;
    });

    // Convertir en tableau trié par date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };
  // Types de produits
  const productTypes = [
    { value: "matériel", label: "Matériel" },
    { value: "consommable", label: "Consommable" },
    { value: "périssable", label: "Périssable" },
  ];

  // Charger les produits depuis Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const unsubscribe = onSnapshot(
          collection(db, "stock"),
          async (querySnapshot) => {
            const productsList = await Promise.all(
              querySnapshot.docs.map(async (docSnap) => {
                const product = { id: docSnap.id, ...docSnap.data() };
                const opsSnapshot = await getDocs(collection(db, docSnap.id));
                const ops = opsSnapshot.docs.map((d) => d.data());
                const achat = ops
                  .filter((op) => op.action === "achat")
                  .reduce((sum, op) => sum + (op.quantite || 0), 0);
                const perte = ops
                  .filter((op) => op.action === "perte")
                  .reduce((sum, op) => sum + (op.quantite || 0), 0);
                const production = ops
                  .filter((op) => op.action === "production")
                  .reduce((sum, op) => sum + (op.quantite || 0), 0);

                return {
                  ...product,
                  quantite: achat - production - perte,
                };
              })
            );
            setProducts(productsList);
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error.message);
        toast.error("Erreur lors du chargement du stock");
      }
    };
    fetchProducts();
    if (operations.length > 0) {
      setGroupedData(groupOperationsByDate(operations));
    }
  }, [operationDialogOpen, isDialogOpen]);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    if (e?.target) {
      //Gerer les champs input simple
      const { name, value } = e.target;
      setCurrentProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      //Gerer le champ select
      const unite = e;
      setCurrentProduct({ ...currentProduct, unite: unite });
    }
  };

  // Enregistrer ou mettre à jour un produit
  const saveProduct = async () => {
    try {
      if (!currentProduct.nom || !currentProduct.type) {
        toast.error("Veuillez remplir tous les champs correctement");
        return;
      }
      let colname = `${currentProduct.type}_${new Date().getTime()}`;
      const productRef = doc(db, "stock", `${colname}`);
      await setDoc(productRef, {
        ...currentProduct,
      });
      toast.success("Produit ajouté au stock");

      // Recharger la liste
      await stock_recharge({ colname, currentProduct });
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCurrentProduct({
      nom: "",
      type: "matériel",
      unite: "",
      icone: "",
    });
    setIsEditing(false);
  };

  const stock_recharge = async () => {};
  // Filtrer les produits par type
  const filteredProducts =
    filter === "tous"
      ? products
      : products.filter((product) => product.type === filter);

  return (
    <div className="p-2 md:p-2 min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden">
        {/* En-tête */}
        <div className="p-2 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="bg-white text-doctor-deeporange border-doctor-orange">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les produits</SelectItem>
                  {productTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-doctor-red hover:bg-doctor-deeporange text-white"
                    onClick={resetForm}>
                    Ajouter un Produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-doctor-deeporange">
                      {isEditing ? "Modifier le Produit" : "Nouveau Produit"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    {/* Nom du produit */}
                    <div>
                      <Label htmlFor="nom" className="text-doctor-deeporange">
                        Nom du produit*
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={currentProduct.nom}
                        onChange={handleChange}
                        className="mt-1 border-doctor-orange focus:ring-doctor-red"
                        required
                      />
                    </div>
                    {/* Unite de mesure du produit */}
                    <div>
                      <Label htmlFor="nom" className="text-doctor-deeporange">
                        Unite de mesure du produit*
                      </Label>
                      <Select
                        id="unite"
                        name="unite"
                        value={`${currentProduct.unite}-${currentProduct.symbole}`}
                        required
                        onValueChange={handleChange}>
                        <SelectTrigger className="mt-1 border-doctor-orange focus:ring-doctor-red">
                          <SelectValue placeholder="Sélectionner une unité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=".">unité (.)</SelectItem>
                          <SelectItem value="kg">kilogramme (kg)</SelectItem>
                          <SelectItem value="g">gramme (g)</SelectItem>
                          <SelectItem value="l">litre (l)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Type de produit */}
                    <div>
                      <Label htmlFor="type" className="text-doctor-deeporange">
                        Type de produit*
                      </Label>
                      <Select
                        value={currentProduct.type}
                        onValueChange={(value) =>
                          setCurrentProduct({ ...currentProduct, type: value })
                        }>
                        <SelectTrigger className="border-doctor-orange focus:ring-doctor-red">
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Icone de produit */}
                    <div>
                      <Label htmlFor="type" className="text-doctor-deeporange">
                        Icone de produit*
                      </Label>
                      <Input
                        id="icone"
                        name="icone"
                        className="mt-1 border-doctor-orange focus:ring-doctor-red"
                        required
                        value={currentProduct.icone}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            icone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="border-doctor-red text-doctor-red hover:bg-doctor-red/10">
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={saveProduct}
                      className="bg-doctor-red hover:bg-doctor-deeporange">
                      {isEditing ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-doctor-deeporange text-lg font-medium">
                {filter === "tous"
                  ? "Aucun produit en stock. Commencez par en ajouter un."
                  : `Aucun produit de type "${
                      productTypes.find((t) => t.value === filter)?.label
                    }" trouvé.`}
              </div>
            </div>
          ) : (
            <div className="text-left overflow-x-auto">
              <Table className="text-xs min-w-full">
                <TableHeader className="bg-doctor-orange/10">
                  <TableRow>
                    <TableHead className="text-doctor-deeporange font-bold">
                      Nom
                    </TableHead>
                    <TableHead className="text-doctor-deeporange font-bold">
                      Type
                    </TableHead>
                    <TableHead className="text-doctor-deeporange font-bold">
                      Qté Disponible
                    </TableHead>
                    <TableHead className="text-doctor-deeporange font-bold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-doctor-cream/30">
                      <TableCell className="font-medium text-doctor-deeporange">
                        <span className="text-lg">{product.icone}</span>
                        {`${product.nom}`}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.type === "matériel"
                              ? "bg-blue-100 text-blue-800"
                              : product.type === "consommable"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {
                            productTypes.find((t) => t.value === product.type)
                              ?.label
                          }
                        </span>
                      </TableCell>
                      <TableCell>
                        {`${product.quantite} ${
                          product.unite ? product.unite : "."
                        }` ?? "."}
                      </TableCell>
                      <TableCell>
                        <Dialog
                          open={operationDialogOpen}
                          onOpenChange={(open) => {
                            setOperationDialogOpen(open);
                            setSelectedProduct(product);
                            fetchOperations(product.id);
                            if (!open) {
                              setSelectedProduct(null);
                              setOperation({
                                action: "achat",
                                quantite: "",
                                date: new Date().toISOString().slice(0, 10),
                              });
                            }
                          }}>
                          <DialogTrigger asChild>
                            <Button>Voir</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-doctor-deeporange">
                                Historique – {selectedProduct?.nom}
                              </DialogTitle>
                              <DialogDescription>
                                Ajoutez des opérations ou consultez l’historique
                                de ce produit.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                              <div>
                                <Label className="text-doctor-deeporange">
                                  Type d'opération*
                                </Label>
                                <Select
                                  value={operation.action}
                                  onValueChange={(value) =>
                                    setOperation((prev) => ({
                                      ...prev,
                                      action: value,
                                    }))
                                  }>
                                  <SelectTrigger className="border-doctor-orange focus:ring-doctor-red">
                                    <SelectValue placeholder="Type d'opération" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="achat">Achat</SelectItem>
                                    <SelectItem value="production">
                                      Production
                                    </SelectItem>
                                    <SelectItem value="perte">Perte</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-doctor-deeporange">
                                  Quantité*
                                </Label>
                                <Input
                                  type="number"
                                  value={operation.quantite}
                                  onChange={(e) =>
                                    setOperation((prev) => ({
                                      ...prev,
                                      quantite: e.target.value,
                                    }))
                                  }
                                  className="border-doctor-orange focus:ring-doctor-red"
                                />
                              </div>

                              <div>
                                <Label className="text-doctor-deeporange">
                                  Date
                                </Label>
                                <Input
                                  type="date"
                                  value={operation.date}
                                  onChange={(e) =>
                                    setOperation((prev) => ({
                                      ...prev,
                                      date: e.target.value,
                                    }))
                                  }
                                  className="border-doctor-orange focus:ring-doctor-red"
                                />
                              </div>

                              <div className="text-right">
                                <Button
                                  onClick={saveOperation}
                                  className="bg-doctor-red hover:bg-doctor-deeporange">
                                  Enregistrer l’opération
                                </Button>
                              </div>
                            </div>

                            {operations.length > 0 && (
                              <div className="mt-6">
                                <h3 className="text-doctor-deeporange text-lg font-semibold mb-2">
                                  Évolution des opérations
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                  <LineChart data={operations}>
                                    <CartesianGrid
                                      stroke="#eee"
                                      strokeDasharray="5 5"
                                    />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                      type="monotone"
                                      dataKey="qte"
                                      stroke="#e25822"
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            <div className="mt-4">
                              <h3 className="text-doctor-deeporange font-semibold mb-2">
                                Historique des opérations
                              </h3>
                              <ul className="space-y-2">
                                {operations.map((op) => (
                                  <li
                                    key={op?.id}
                                    className={`${
                                      op?.action === "achat"
                                        ? "bg-green-400"
                                        : op?.action === "production"
                                        ? "bg-blue-400"
                                        : "bg-red-400"
                                    } border p-2 rounded shadow-sm`}>
                                    <div className="flex justify-between">
                                      <div>
                                        <strong>
                                          {op?.action.toUpperCase()} :
                                        </strong>
                                      </div>
                                      <div>
                                        {" "}
                                        <strong>{op?.quantite}</strong> unités –
                                      </div>
                                      <div>{op?.date}</div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
