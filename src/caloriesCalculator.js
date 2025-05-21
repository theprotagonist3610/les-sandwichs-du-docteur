export function CalculateurCalories({
  poids, // en kg
  taille, // en cm
  age, // en années
  sexe, // "homme" ou "femme"
  activite, // "sédentaire", "léger", "modéré", "actif", "très actif"
  formule = "mifflin", // ou "harris"
}) {
  let BMR = 0;

  if (formule === "harris") {
    if (sexe === "homme") {
      BMR = 88.362 + 13.397 * poids + 4.799 * taille - 5.677 * age;
    } else {
      BMR = 447.593 + 9.247 * poids + 3.098 * taille - 4.33 * age;
    }
  } else {
    // formule mifflin par défaut
    if (sexe === "homme") {
      BMR = 10 * poids + 6.25 * taille - 5 * age + 5;
    } else {
      BMR = 10 * poids + 6.25 * taille - 5 * age - 161;
    }
  }

  const facteurs = {
    sédentaire: 1.2,
    léger: 1.375,
    modéré: 1.55,
    actif: 1.725,
    "très actif": 1.9,
  };

  const facteur = facteurs[activite] || 1.2;
  return Math.round(BMR * facteur);
}
