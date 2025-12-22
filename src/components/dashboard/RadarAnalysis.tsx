import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { District } from "@/lib/district";

interface RadarAnalysisProps {
  district: District;
}

export const RadarAnalysis = ({ district }: RadarAnalysisProps) => {
  const radarData = [
    { subject: "Altyapı", value: district.scores.infrastructure, fullMark: 10 },
    { subject: "Çevre", value: district.scores.environment, fullMark: 10 },
    { subject: "Sosyal", value: district.scores.social, fullMark: 10 },
    { subject: "Ulaşım", value: district.scores.transportation, fullMark: 10 },
    { subject: "Güvenlik", value: district.scores.security, fullMark: 10 },
    { subject: "Eğitim", value: district.scores.education, fullMark: 10 },
    { subject: "Sağlık", value: district.scores.health, fullMark: 10 },
  ];

  return (
    <div className="glass-card p-6 animate-fade-up">
      <h3 className="text-lg font-bold text-foreground mb-4">
        {district.name} - Kriter Analizi
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar
              name={district.name}
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
