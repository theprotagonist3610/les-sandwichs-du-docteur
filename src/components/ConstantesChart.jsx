// ConstantesChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

export default function ConstantesChart({ data, objectif }) {
  const formatted = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    poids: parseFloat(entry.poids),
    calories: parseFloat(entry.calories),
    activite: entry.activite,
  }));

  const moyenneCalories = Math.round(
    formatted.reduce((acc, e) => acc + e.calories, 0) / formatted.length || 0
  );

  const lastCalories =
    formatted.length > 0 ? formatted[formatted.length - 1].calories : 0;
  const previousCalories =
    formatted.length > 1
      ? formatted[formatted.length - 2].calories
      : lastCalories;

  const caloriesColor = lastCalories <= moyenneCalories ? "#22c55e" : "#dc2626";
  const statusText =
    lastCalories <= moyenneCalories
      ? "✅ Dans la limite calorique"
      : "⚠️ Au-dessus de la limite";
  const statusClass =
    lastCalories <= moyenneCalories ? "text-green-600" : "text-red-600";
  const tendance =
    lastCalories > previousCalories
      ? "⬆️"
      : lastCalories < previousCalories
      ? "⬇️"
      : "➡️";

  const seuilsActivite = {
    sédentaire: [1600, 2200],
    léger: [1800, 2400],
    modéré: [2000, 2600],
    actif: [2200, 2800],
    "très actif": [2400, 3000],
  };

  const lastActivite =
    formatted.length > 0 ? formatted[formatted.length - 1].activite : "modéré";
  const [defaultMin, defaultMax] = seuilsActivite[lastActivite] || [2000, 2600];

  const minNorm = objectif?.min ? parseInt(objectif.min) : defaultMin;
  const maxNorm = objectif?.max ? parseInt(objectif.max) : defaultMax;

  return (
    <div className="mt-4 w-full overflow-x-auto">
      <h4 className="font-semibold text-doctor-red mb-2">
        Suivi du poids et des calories
      </h4>
      <p className={`text-sm mb-1 font-medium ${statusClass}`}>
        {statusText} • Moyenne : {moyenneCalories} kcal • Tendance : {tendance}
      </p>
      <div className="w-[320px] sm:w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formatted}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" unit="kg" />
            <YAxis yAxisId="right" orientation="right" unit="kcal" />
            <Tooltip />
            <Legend />
            <ReferenceArea
              yAxisId="right"
              y1={minNorm}
              y2={maxNorm}
              strokeOpacity={0.1}
              fill="#ffb564"
              fillOpacity={0.2}
              label={{
                position: "top",
                value: `Plage ${
                  objectif?.min ? "objectif" : "normale"
                } : ${minNorm}-${maxNorm} kcal`,
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="poids"
              stroke="#a41624"
              strokeWidth={2}
              dot
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="calories"
              stroke={caloriesColor}
              strokeWidth={2}
              dot
            />
            <ReferenceLine
              yAxisId="right"
              y={moyenneCalories}
              stroke="#d9571d"
              strokeDasharray="4 2"
              label="Limite normale"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
