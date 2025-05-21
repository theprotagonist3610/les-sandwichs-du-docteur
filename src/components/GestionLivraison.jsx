import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toaster, toast } from "sonner";
import ListeProduits from "./ListeProduits";
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

const statusOptions = ["en attente", "en cours", "livrée"];
const deliveryColors = {
  "en attente": "bg-yellow-100 text-yellow-800",
  "en cours": "bg-blue-100 text-blue-800",
  livrée: "bg-green-100 text-green-800",
};

export function GestionLivraison() {
  const [loading, setLoading] = useState(true);
  const [commandes, setCommandes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("toutes");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(
      collection(db, "toutes_les_commandes"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommandes(list);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur Firestore:", error);
        toast.error("Erreur lors du chargement des commandes");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const updateStatut = async (commandeId, nouveauStatut) => {
    try {
      const ref = doc(db, "toutes_les_commandes", commandeId);
      await updateDoc(ref, { statut: nouveauStatut });
      toast.success("Statut mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const commandesFiltrees = commandes.filter((c) =>
    selectedStatus === "toutes" ? true : c.statut === selectedStatus
  );
  // .filter(
  //   (c) =>
  //     c.nom_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     c.date.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const totalPages = Math.ceil(commandesFiltrees.length / itemsPerPage);
  const displayedCommandes = commandesFiltrees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <Toaster position="top-right" richColors />
      {loading ? (
        <div className="p-6 animate-pulse">
          <div className="h-6 w-1/3 bg-doctor-cream mb-4 rounded"></div>
          <div className="h-4 w-full bg-doctor-cream rounded mb-2"></div>
          <div className="h-4 w-full bg-doctor-cream rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-doctor-cream rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-doctor-cream rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-doctor-cream rounded"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px] border-doctor-orange text-doctor-deeporange">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toutes">Toutes</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Rechercher un client ou une date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-doctor-orange"
            />
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-doctor-orange/10">
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedCommandes.map((commande) => (
                  <TableRow
                    key={commande.id}
                    className="hover:bg-doctor-cream/30">
                    <TableCell>{commande.client}</TableCell>
                    <TableCell>{commande.date_de_livraison}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          deliveryColors[commande.statut]
                        }`}>
                        {commande.statut}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 text-sm">
                        {/*il faut aussi le statut paye ou non paye de chaque commande, le code de commande*/}
                        <ListeProduits
                          produits={
                            commande.details_de_la_commande
                          }></ListeProduits>
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={commande.statut}
                          onValueChange={(val) =>
                            updateStatut(commande.id, val)
                          }>
                          <SelectTrigger className="w-[140px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">Voir</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-doctor-deeporange">
                                Détails de la commande
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <div>
                                <strong>Client :</strong> {commande.client}
                              </div>
                              <div>
                                <strong>Date :</strong>{" "}
                                {/*il aut mettre aussi la date de creation*/}
                                {commande.date_de_livraison}
                              </div>
                              <div>
                                <strong>Adresse :</strong>{" "}
                                {commande.lieu_de_livraison}
                              </div>
                              <div>
                                <strong>Produits :</strong>
                                <ul className="list-disc pl-4">
                                  {(commande.details_de_la_commande || []).map(
                                    (prod, idx) => (
                                      <li key={idx}>
                                        {
                                          <div className="p-1 bg-doctor-cream/70 rounded-sm">
                                            <ul>
                                              {Object.entries(prod).map(
                                                (el, index) => (
                                                  <li
                                                    key={
                                                      index
                                                    }>{`${el[0]} : ${el[1]}`}</li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        }
                                        {prod.nom} x {prod.qte}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  className="border-doctor-red text-doctor-red">
                                  Fermer
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}>
                Précédent
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}>
                Suivant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
