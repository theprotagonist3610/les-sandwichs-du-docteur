// UserConstantesDialog.jsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { toast } from "sonner";
import ConstantesChart from "./ConstantesChart";
import { useUser } from "../UserContext";
import { CalculateurCalories } from "../caloriesCalculator";

export default function UserConstantesDialog({ open, onClose }) {
  const { utilisateur } = useUser();
  const [form, setForm] = useState({
    poids: "",
    age: "",
    taille: "",
    activite: "",
    alcool: "",
    sucre: "",
    huile: "",
    nourriture: "",
    repas: "",
    profession: "",
    eau: "",
    stupefiant: "",
  });
  const [objectif, setObjectif] = useState({ min: "", max: "" });
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [estimation, setEstimation] = useState(null);
  const [optionsAlcool, setOptionsAlcool] = useState([]);
  const [optionsStupefiants, setOptionsStupefiants] = useState([]);
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Les Sandwichs Du Docteur";
  useEffect(() => {
    let interval;
    let timeout;
    if (loading) {
      let i = 0;
      let forward = true;
      interval = setInterval(() => {
        if (forward) {
          i++;
          setAnimatedText(fullText.slice(0, i));
          if (i === fullText.length) {
            clearInterval(interval);
            timeout = setTimeout(() => {
              forward = false;
              interval = setInterval(() => {
                i--;
                setAnimatedText(fullText.slice(0, i));
                if (i === 0) {
                  clearInterval(interval);
                  forward = true;
                  interval = setInterval(() => {
                    i++;
                    setAnimatedText(fullText.slice(0, i));
                    if (i === fullText.length) {
                      clearInterval(interval);
                      timeout = setTimeout(() => {
                        forward = false;
                      }, 500);
                    }
                  }, 150);
                }
              }, 100);
            }, 500);
          }
        }
      }, 150);
    } else {
      setAnimatedText("");
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading]);

  const seuilsActivite = {
    sédentaire: [1600, 2200],
    léger: [1800, 2400],
    modéré: [2000, 2600],
    actif: [2200, 2800],
    "très actif": [2400, 3000],
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!utilisateur) return;
      const ref = doc(db, "utilisateurs", utilisateur.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const lastConstantes =
          data.constantes?.length > 0
            ? data.constantes[data.constantes.length - 1]
            : null;
        setChartData(data.constantes || []);
        setObjectif(data.objectifCalories || { min: "", max: "" });
        if (lastConstantes) {
          setForm({
            poids: lastConstantes.poids || "",
            age: lastConstantes.age || "",
            taille: lastConstantes.taille || "",
            activite: lastConstantes.activite || "",
            alcool: lastConstantes.alcool || "",
            sucre: lastConstantes.sucre || "",
            huile: lastConstantes.huile || "",
            nourriture: lastConstantes.nourriture || "",
            repas: lastConstantes.repas || "",
            profession: lastConstantes.profession || "",
            eau: lastConstantes.eau || "",
            stupefiant: lastConstantes.stupefiant || "",
          });
        }
      }
      const alcoolSnap = await getDocs(collection(db, "alcool"));
      setOptionsAlcool(alcoolSnap.docs.map((doc) => doc.data().nom));
      const stupsSnap = await getDocs(collection(db, "stupefiants"));
      setOptionsStupefiants(stupsSnap.docs.map((doc) => doc.data().nom));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!utilisateur) return;
      const ref = doc(db, "utilisateurs", utilisateur.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setChartData(data.constantes || []);
        setObjectif(data.objectifCalories || { min: "", max: "" });
      }
      const alcoolSnap = await getDocs(collection(db, "alcool"));
      setOptionsAlcool(alcoolSnap.docs.map((doc) => doc.data().nom));
      const stupsSnap = await getDocs(collection(db, "stupefiants"));
      setOptionsStupefiants(stupsSnap.docs.map((doc) => doc.data().nom));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const { poids, taille, age, activite } = form;
    if (poids && taille && age && activite) {
      const calories = CalculateurCalories({
        poids: +poids,
        taille: +taille,
        age: +age,
        sexe: "homme",
        activite,
      });
      setEstimation(calories);
    } else {
      setEstimation(null);
    }
  }, [form.poids, form.taille, form.age, form.activite]);

  const getColorForCalories = (cal) => {
    const [min, max] = seuilsActivite[form.activite] || [1600, 2600];
    if (cal < min || cal > max) return "bg-red-100 text-red-800";
    return "bg-green-100 text-green-800";
  };

  const validateForm = () => {
    const requiredFields = [
      "poids",
      "age",
      "taille",
      "activite",
      "alcool",
      "sucre",
      "huile",
      "nourriture",
      "repas",
      "profession",
      "eau",
      "stupefiant",
    ];
    for (const field of requiredFields) {
      if (!form[field]) {
        toast.error(`Veuillez remplir le champ : ${field}`);
        return false;
      }
    }
    // if (!objectif.min || !objectif.max) {
    //   toast.error("Veuillez renseigner l'objectif calorique min et max.");
    //   return false;
    // }
    if (!estimation) {
      toast.error("Estimation calorique invalide.");
      return false;
    }
    return true;
  };

  const analyseAI = async (payload) => {
    let re = await Promise.all([
      new Promise(function (res, rej) {
        setTimeout(() => {
          res("Voici votre resultat");
        }, 5000);
      }),
    ]);
    return re;
  };

  const handleAnalyse = async () => {
    if (!utilisateur) return;
    if (!validateForm()) return;

    setLoading(true);
    const constantes = {
      ...form,
      calories: estimation,
      date: new Date().toISOString(),
    };
    try {
      const userRef = doc(db, "utilisateurs", utilisateur.uid);
      await updateDoc(userRef, {
        constantes: arrayUnion(constantes),
        ...(objectif.min && objectif.max && { objectifCalories: objectif }),
      });
      toast.success("Analyse en cours...");
      const resultatAI = await analyseAI({ ...form, estimation, objectif });
      setResultat(resultatAI);
    } catch (e) {
      toast.error("Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const [min, max] = seuilsActivite[form.activite] || [1600, 2600];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Données personnelles</DialogTitle>
          {estimation && !resultat && (
            <div
              className={`absolute top-4 right-6 text-xs font-semibold px-3 py-1 rounded shadow ${getColorForCalories(
                estimation
              )}`}>
              Estimation : {estimation} kcal
              <br />
              <span className="text-[10px] font-normal">
                Plage normale : {min}–{max} kcal
              </span>
              {objectif.min && objectif.max && (
                <div className="text-[10px] font-medium mt-1 text-doctor-orange">
                  🌟 Objectif : {objectif.min}–{objectif.max} kcal
                </div>
              )}
            </div>
          )}
        </DialogHeader>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="flex space-x-2">
              <div
                className="h-4 w-4 rounded-full animate-bounce bg-[#a41624]"
                style={{ animationDelay: "0s" }}></div>
              <div
                className="h-4 w-4 rounded-full animate-bounce bg-[#ffb564]"
                style={{ animationDelay: "0.15s" }}></div>
              <div
                className="h-4 w-4 rounded-full animate-bounce bg-[#d9571d]"
                style={{ animationDelay: "0.3s" }}></div>
            </div>
            <div className="text-sm font-semibold text-doctor-deeporange h-6">
              {animatedText}
            </div>
          </div>
        ) : resultat ? (
          <div className="p-4 border rounded bg-gray-50 whitespace-pre-wrap text-sm">
            {resultat}
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {/* Données anthropométriques */}
            <fieldset className="border border-doctor-deeporange rounded p-3">
              <legend className="text-sm font-semibold mb-2">
                Données anthropométriques
              </legend>
              <div className="space-y-3">
                {[
                  { label: "Poids (kg)", key: "poids", type: "text" },
                  { label: "Âge", key: "age", type: "text" },
                  { label: "Taille (cm)", key: "taille", type: "text" },
                ].map(({ label, key, type }) => (
                  <input
                    key={key}
                    className="input w-full"
                    placeholder={label}
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ))}
              </div>
            </fieldset>

            {/* Données professionnelles */}
            <fieldset className="border border-doctor-deeporange rounded p-3">
              <legend className="text-sm font-semibold mb-2">
                Données professionnelles
              </legend>
              <div className="space-y-3">
                <input
                  className="input w-full"
                  placeholder="Profession"
                  value={form.profession}
                  onChange={(e) =>
                    setForm({ ...form, profession: e.target.value })
                  }
                />
                <select
                  className="input w-full"
                  value={form.activite}
                  onChange={(e) =>
                    setForm({ ...form, activite: e.target.value })
                  }>
                  <option value="">Niveau d'activité</option>
                  {Object.keys(seuilsActivite).map((act) => (
                    <option key={act} value={act}>
                      {act}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            {/* Données nutritionnelles */}
            <fieldset className="border border-doctor-deeporange rounded p-3">
              <legend className="text-sm font-semibold mb-2">
                Données nutritionnelles
              </legend>
              <div className="space-y-3">
                <input
                  className="input w-full"
                  placeholder="Nombre de repas par jour"
                  type="number"
                  value={form.repas}
                  onChange={(e) => setForm({ ...form, repas: e.target.value })}
                />
                <input
                  className="input w-full"
                  placeholder="Litres d'eau par jour"
                  type="text"
                  value={form.eau}
                  onChange={(e) => setForm({ ...form, eau: e.target.value })}
                />
                <input
                  className="input w-full"
                  placeholder="Nourriture préférée"
                  type="text"
                  value={form.nourriture}
                  onChange={(e) =>
                    setForm({ ...form, nourriture: e.target.value })
                  }
                />
                <select
                  className="input w-full"
                  value={form.alcool}
                  onChange={(e) =>
                    setForm({ ...form, alcool: e.target.value })
                  }>
                  <option value="">Consommation d'alcool</option>
                  {optionsAlcool.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {["sucre", "huile"].map((key) => (
                  <select
                    key={key}
                    className="input w-full"
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }>
                    <option value="">Consommation de {key}</option>
                    <option value="faible">Faible</option>
                    <option value="moderee">Modérée</option>
                    <option value="exageree">Exagérée</option>
                  </select>
                ))}
                <select
                  className="input w-full"
                  value={form.stupefiant}
                  onChange={(e) =>
                    setForm({ ...form, stupefiant: e.target.value })
                  }>
                  <option value="">Consommation de stupéfiants</option>
                  {optionsStupefiants.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="input w-full"
                placeholder="Objectif Min kcal"
                value={objectif.min}
                onChange={(e) =>
                  setObjectif({ ...objectif, min: e.target.value })
                }
              />
              <input
                className="input w-full"
                placeholder="Objectif Max kcal"
                value={objectif.max}
                onChange={(e) =>
                  setObjectif({ ...objectif, max: e.target.value })
                }
              />
            </div>

            {/* Graphique */}
            {showChart && (
              <ConstantesChart data={chartData} objectif={objectif} />
            )}
          </div>
        )}

        <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-3">
          {!resultat && !loading && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowChart(true)}>
              Suivi
            </Button>
          )}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto">
              {resultat || loading ? "Fermer" : "Annuler"}
            </Button>
            {!resultat && !loading && (
              <Button onClick={handleAnalyse} className="w-full sm:w-auto">
                Analyser
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
