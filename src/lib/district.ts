// Shared District types and helpers. Extracted from previous src/data/districtData.ts

export interface District {
  id: number;
  name: string;
  coordinates: [number, number];
  radius: number;
  scores: {
    infrastructure: number;
    environment: number;
    social: number;
    transportation: number;
    security: number;
    education: number;
    health: number;
    overall: number;
  };
  negativeFactors: {
    uncontrolledMigration: number;
    informalSettlement: number;
    crimeRate: number;
    trafficCongestion: number;
    noisePollution: number;
  };
  trendData: number[];
  recommendedActions: {
    action: string;
    potentialScore: number;
    priority: 'high' | 'medium' | 'low';
    budget: string;
  }[];
}

export const getScoreClass = (score: number): string => {
  if (score >= 8.5) return "score-excellent";
  if (score >= 7.0) return "score-good";
  if (score >= 5.5) return "score-moderate";
  if (score >= 4.0) return "score-warning";
  return "score-critical";
};

export const getScoreColor = (score: number): string => {
  if (score >= 8.5) return "hsl(142, 71%, 35%)";
  if (score >= 7.0) return "hsl(84, 60%, 45%)";
  if (score >= 5.5) return "hsl(45, 100%, 50%)";
  if (score >= 4.0) return "hsl(30, 100%, 50%)";
  return "hsl(0, 72%, 51%)";
};

export const criteriaWeights = {
  infrastructure: { name: "Altyapı", weight: 0.15, icon: "🏗️" },
  environment: { name: "Çevre", weight: 0.12, icon: "🌳" },
  social: { name: "Sosyal", weight: 0.13, icon: "👥" },
  transportation: { name: "Ulaşım", weight: 0.15, icon: "🚌" },
  security: { name: "Güvenlik", weight: 0.15, icon: "🛡️" },
  education: { name: "Eğitim", weight: 0.15, icon: "🎓" },
  health: { name: "Sağlık", weight: 0.15, icon: "❤️" },
};
