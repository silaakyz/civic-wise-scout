import { useState } from "react";
import { District, criteriaWeights } from "@/data/districtData";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, PlayCircle, Save } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ScenarioAnalysisProps {
  districts: District[];
}

export const ScenarioAnalysis = ({ districts }: ScenarioAnalysisProps) => {
  const [weights, setWeights] = useState({
    infrastructure: 15,
    environment: 12,
    social: 13,
    transportation: 15,
    security: 15,
    education: 15,
    health: 15,
  });

  const [scenarioResults, setScenarioResults] = useState<
    { name: string; original: number; scenario: number; change: number }[] | null
  >(null);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const calculateScenarioScore = (district: District) => {
    const normalizedWeights = Object.fromEntries(
      Object.entries(weights).map(([key, val]) => [key, val / totalWeight])
    );

    const score =
      district.scores.infrastructure * normalizedWeights.infrastructure +
      district.scores.environment * normalizedWeights.environment +
      district.scores.social * normalizedWeights.social +
      district.scores.transportation * normalizedWeights.transportation +
      district.scores.security * normalizedWeights.security +
      district.scores.education * normalizedWeights.education +
      district.scores.health * normalizedWeights.health;

    return score;
  };

  const runScenario = () => {
    const results = districts.map((d) => {
      const scenarioScore = calculateScenarioScore(d);
      return {
        name: d.name,
        original: d.scores.overall,
        scenario: scenarioScore,
        change: scenarioScore - d.scores.overall,
      };
    });
    setScenarioResults(results.sort((a, b) => b.scenario - a.scenario));
  };

  const resetWeights = () => {
    setWeights({
      infrastructure: 15,
      environment: 12,
      social: 13,
      transportation: 15,
      security: 15,
      education: 15,
      health: 15,
    });
    setScenarioResults(null);
  };

  const getBarColor = (change: number) => {
    if (change > 0.3) return "hsl(142, 71%, 35%)";
    if (change > 0) return "hsl(84, 60%, 45%)";
    if (change > -0.3) return "hsl(45, 100%, 50%)";
    return "hsl(0, 72%, 51%)";
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Senaryo Tabanlı Analiz
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Kriter ağırlıklarını değiştirerek farklı senaryoları test edin
            </p>
          </div>
          <Badge
            variant={totalWeight === 100 ? "secondary" : "destructive"}
            className="text-sm"
          >
            Toplam: %{totalWeight}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(criteriaWeights).map(([key, config]) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <span>{config.icon}</span>
                  {config.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  %{weights[key as keyof typeof weights]}
                </Badge>
              </div>
              <Slider
                value={[weights[key as keyof typeof weights]]}
                onValueChange={(value) =>
                  setWeights((prev) => ({ ...prev, [key]: value[0] }))
                }
                max={30}
                min={0}
                step={1}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
          <Button onClick={runScenario} className="gap-2">
            <PlayCircle className="w-4 h-4" />
            Senaryoyu Çalıştır
          </Button>
          <Button variant="outline" onClick={resetWeights} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </Button>
          {scenarioResults && (
            <Button variant="secondary" className="gap-2">
              <Save className="w-4 h-4" />
              Senaryoyu Kaydet
            </Button>
          )}
        </div>
      </div>

      {scenarioResults && (
        <div className="glass-card p-6 animate-fade-up">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Senaryo Sonuçları
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scenarioResults}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  type="number"
                  domain={[0, 10]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [
                    value.toFixed(2),
                    name === "scenario" ? "Senaryo Skoru" : "Orijinal Skor",
                  ]}
                />
                <Bar dataKey="original" name="Orijinal" fill="hsl(var(--muted))" radius={4} />
                <Bar dataKey="scenario" name="Senaryo" radius={4}>
                  {scenarioResults.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.change)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-score-excellent">
                {scenarioResults.filter((r) => r.change > 0.3).length}
              </p>
              <p className="text-xs text-muted-foreground">Önemli Artış</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-score-good">
                {scenarioResults.filter((r) => r.change > 0 && r.change <= 0.3).length}
              </p>
              <p className="text-xs text-muted-foreground">Hafif Artış</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-score-warning">
                {scenarioResults.filter((r) => r.change <= 0 && r.change > -0.3).length}
              </p>
              <p className="text-xs text-muted-foreground">Hafif Düşüş</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-score-critical">
                {scenarioResults.filter((r) => r.change <= -0.3).length}
              </p>
              <p className="text-xs text-muted-foreground">Önemli Düşüş</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
