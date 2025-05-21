// api/conseil.js
import express from "express";
import { Configuration, OpenAIApi } from "openai";

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

router.post("/api/conseil", async (req, res) => {
  const { poids, taille, age, activite, calories } = req.body;

  const prompt = `
Tu es un coach nutritionnel drôle et bienveillant. Voici les infos :
- Poids : ${poids} kg
- Taille : ${taille} cm
- Âge : ${age}
- Activité : ${activite}
- Calories estimées : ${calories} kcal

Analyse les données et réponds en JSON structuré comme ceci :
{
  "constat": "...",
  "explication": "...",
  "recommandation": "..."
}
Donne un conseil court, amusant et utile !
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "Tu es un coach nutritionnel bienveillant.",
        },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.data.choices[0].message.content;
    const match = text.match(/\{[^}]+\}/s);
    const conseil = match ? JSON.parse(match[0]) : null;

    if (!conseil) {
      return res.status(500).json({ error: "Erreur de parsing du conseil." });
    }

    res.json(conseil);
  } catch (err) {
    console.error("Erreur OpenAI :", err.message);
    res.status(500).json({ error: "Impossible de générer le conseil." });
  }
});

export default router;
