import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Profil() {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const uid = auth.currentUser?.uid;
  const userRef = doc(db, "users", uid);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(userRef);
      setUserData(snap.data());
    };
    fetchData();
  }, []);

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveField = async () => {
    try {
      await updateDoc(userRef, { [editingField]: tempValue });
      setUserData({ ...userData, [editingField]: tempValue });
      setEditingField(null);
      toast.success("Mise à jour effectuée");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (!userData) return <div className="p-4">Chargement...</div>;

  const Section = ({ title, children }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const InfoRow = ({ label, field, type = "text", options }) => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <Label className="font-medium">{label}</Label>
      {editingField === field ? (
        <div className="flex gap-2">
          {type === "select" ? (
            <Select value={tempValue} onValueChange={setTempValue}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          )}
          <Button size="sm" onClick={saveField}>
            Enregistrer
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingField(null)}>
            Annuler
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {userData[field]}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => startEditing(field, userData[field])}>
            Modifier
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">👤 Mon Profil</h1>

      <Section title="Informations personnelles">
        <InfoRow label="Prénom" field="prenom" />
        <InfoRow label="Nom" field="nom" />
        <InfoRow
          label="Sexe"
          field="sexe"
          type="select"
          options={["Homme", "Femme"]}
        />
        <InfoRow label="Date de naissance" field="dateNaissance" type="text" />
        <InfoRow label="Email" field="email" />
        <InfoRow label="Téléphone" field="telephone" />
        <InfoRow label="Profession" field="profession" />
        <InfoRow
          label="Activité physique"
          field="activitePhysique"
          type="select"
          options={["faible", "moderee", "elevee"]}
        />
      </Section>

      <Section title="Profil nutritionnel">
        <p className="text-sm text-muted-foreground">
          Fonctionnalité à venir...
        </p>
      </Section>

      <Section title="Points et Bonus">
        <p className="text-sm">
          Points actuels : <strong>120</strong>
        </p>
        <p className="text-sm">
          Badge actuel : <strong>Explorateur</strong>
        </p>
      </Section>

      <Section title="Paramètres">
        <Button
          variant="destructive"
          onClick={async () => {
            await auth.signOut();
            toast("Vous avez été déconnecté");
            window.location.href = "/";
          }}>
          Déconnexion
        </Button>
      </Section>
    </div>
  );
}
