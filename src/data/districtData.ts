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

export const districtData: District[] = [
  {
    id: 1,
    name: "Alsancak",
    coordinates: [38.4382, 27.1433],
    radius: 600,
    scores: {
      infrastructure: 9.5,
      environment: 9.2,
      social: 9.8,
      transportation: 9.6,
      security: 9.4,
      education: 9.7,
      health: 9.3,
      overall: 9.5,
    },
    negativeFactors: {
      uncontrolledMigration: 1.5,
      informalSettlement: 1.0,
      crimeRate: 0.8,
      trafficCongestion: 2.5,
      noisePollution: 3.0,
    },
    trendData: [9.1, 9.3, 9.4, 9.5],
    recommendedActions: [
      { action: "Kordon boyunca bisiklet yolu genişletme", potentialScore: 1.8, priority: "medium", budget: "₺5M" },
      { action: "Tarihi binaların restorasyonu", potentialScore: 1.5, priority: "low", budget: "₺12M" },
      { action: "Akıllı park sistemi kurulumu", potentialScore: 1.2, priority: "high", budget: "₺3M" },
    ],
  },
  {
    id: 2,
    name: "Karşıyaka",
    coordinates: [38.4682, 27.1255],
    radius: 800,
    scores: {
      infrastructure: 9.1,
      environment: 8.9,
      social: 9.3,
      transportation: 9.2,
      security: 9.0,
      education: 9.2,
      health: 9.1,
      overall: 9.1,
    },
    negativeFactors: {
      uncontrolledMigration: 2.0,
      informalSettlement: 1.5,
      crimeRate: 1.2,
      trafficCongestion: 3.5,
      noisePollution: 4.0,
    },
    trendData: [8.7, 8.9, 9.0, 9.1],
    recommendedActions: [
      { action: "Sahil şeridi modernizasyonu", potentialScore: 1.9, priority: "high", budget: "₺8M" },
      { action: "Yaya bölgesi genişletme", potentialScore: 1.4, priority: "medium", budget: "₺4M" },
      { action: "Kültür merkezi renovasyonu", potentialScore: 1.3, priority: "low", budget: "₺6M" },
    ],
  },
  {
    id: 3,
    name: "Göztepe",
    coordinates: [38.4012, 27.0892],
    radius: 700,
    scores: {
      infrastructure: 8.8,
      environment: 8.5,
      social: 9.0,
      transportation: 8.9,
      security: 8.7,
      education: 8.9,
      health: 8.8,
      overall: 8.8,
    },
    negativeFactors: {
      uncontrolledMigration: 1.8,
      informalSettlement: 1.2,
      crimeRate: 1.0,
      trafficCongestion: 3.0,
      noisePollution: 3.5,
    },
    trendData: [8.5, 8.6, 8.7, 8.8],
    recommendedActions: [
      { action: "Sahil rekreasyon alanı", potentialScore: 1.7, priority: "high", budget: "₺7M" },
      { action: "Spor kompleksi modernizasyonu", potentialScore: 1.6, priority: "medium", budget: "₺9M" },
      { action: "Akıllı trafik sistemi", potentialScore: 1.4, priority: "high", budget: "₺4M" },
    ],
  },
  {
    id: 4,
    name: "Çiğli",
    coordinates: [38.4925, 27.0432],
    radius: 900,
    scores: {
      infrastructure: 8.2,
      environment: 7.9,
      social: 8.4,
      transportation: 8.3,
      security: 8.1,
      education: 8.3,
      health: 8.2,
      overall: 8.2,
    },
    negativeFactors: {
      uncontrolledMigration: 2.5,
      informalSettlement: 2.0,
      crimeRate: 1.5,
      trafficCongestion: 3.5,
      noisePollution: 4.0,
    },
    trendData: [7.9, 8.0, 8.1, 8.2],
    recommendedActions: [
      { action: "Organize sanayi modernizasyonu", potentialScore: 2.0, priority: "high", budget: "₺15M" },
      { action: "Kuş cenneti koruma projesi", potentialScore: 1.5, priority: "medium", budget: "₺3M" },
      { action: "Toplu konut alanı düzenlemesi", potentialScore: 1.3, priority: "low", budget: "₺8M" },
    ],
  },
  {
    id: 5,
    name: "Narlıdere",
    coordinates: [38.3942, 27.0092],
    radius: 600,
    scores: {
      infrastructure: 7.8,
      environment: 7.5,
      social: 8.0,
      transportation: 7.9,
      security: 7.7,
      education: 7.9,
      health: 7.8,
      overall: 7.8,
    },
    negativeFactors: {
      uncontrolledMigration: 3.0,
      informalSettlement: 2.5,
      crimeRate: 2.0,
      trafficCongestion: 4.0,
      noisePollution: 4.5,
    },
    trendData: [7.5, 7.6, 7.7, 7.8],
    recommendedActions: [
      { action: "Sahil yolu genişletme", potentialScore: 1.8, priority: "high", budget: "₺10M" },
      { action: "Askeri alan çevre düzenlemesi", potentialScore: 1.4, priority: "low", budget: "₺5M" },
      { action: "Spor tesisleri yapımı", potentialScore: 1.6, priority: "medium", budget: "₺7M" },
    ],
  },
  {
    id: 6,
    name: "Bornova",
    coordinates: [38.4683, 27.2144],
    radius: 850,
    scores: {
      infrastructure: 7.2,
      environment: 6.8,
      social: 7.5,
      transportation: 7.3,
      security: 7.0,
      education: 8.5,
      health: 7.1,
      overall: 7.3,
    },
    negativeFactors: {
      uncontrolledMigration: 3.5,
      informalSettlement: 3.0,
      crimeRate: 2.5,
      trafficCongestion: 4.5,
      noisePollution: 5.0,
    },
    trendData: [7.0, 7.1, 7.2, 7.3],
    recommendedActions: [
      { action: "Üniversite çevresi düzenlemesi", potentialScore: 1.9, priority: "high", budget: "₺6M" },
      { action: "Metro bağlantı hatları", potentialScore: 2.0, priority: "high", budget: "₺25M" },
      { action: "Teknoloji merkezi kurulumu", potentialScore: 1.7, priority: "medium", budget: "₺12M" },
    ],
  },
  {
    id: 7,
    name: "Konak",
    coordinates: [38.4192, 27.1350],
    radius: 750,
    scores: {
      infrastructure: 6.5,
      environment: 6.2,
      social: 6.8,
      transportation: 6.6,
      security: 6.4,
      education: 6.7,
      health: 6.5,
      overall: 6.5,
    },
    negativeFactors: {
      uncontrolledMigration: 4.0,
      informalSettlement: 3.5,
      crimeRate: 3.0,
      trafficCongestion: 5.0,
      noisePollution: 5.5,
    },
    trendData: [6.2, 6.3, 6.4, 6.5],
    recommendedActions: [
      { action: "Kemeraltı restorasyon projesi", potentialScore: 2.1, priority: "high", budget: "₺20M" },
      { action: "Tarihi asansör çevre düzenlemesi", potentialScore: 1.6, priority: "medium", budget: "₺4M" },
      { action: "Kültür rotası oluşturma", potentialScore: 1.4, priority: "low", budget: "₺2M" },
    ],
  },
  {
    id: 8,
    name: "Buca",
    coordinates: [38.3825, 27.1717],
    radius: 800,
    scores: {
      infrastructure: 5.5,
      environment: 5.2,
      social: 5.8,
      transportation: 5.6,
      security: 5.4,
      education: 5.9,
      health: 5.3,
      overall: 5.5,
    },
    negativeFactors: {
      uncontrolledMigration: 4.5,
      informalSettlement: 4.0,
      crimeRate: 3.5,
      trafficCongestion: 5.5,
      noisePollution: 6.0,
    },
    trendData: [5.2, 5.3, 5.4, 5.5],
    recommendedActions: [
      { action: "Şirinyer parkı yenileme", potentialScore: 1.5, priority: "medium", budget: "₺5M" },
      { action: "Toplu taşıma güzergah optimizasyonu", potentialScore: 1.8, priority: "high", budget: "₺8M" },
      { action: "Eğitim kampüsü geliştirme", potentialScore: 1.7, priority: "high", budget: "₺15M" },
    ],
  },
  {
    id: 9,
    name: "Bayraklı",
    coordinates: [38.4578, 27.1728],
    radius: 700,
    scores: {
      infrastructure: 4.5,
      environment: 4.2,
      social: 4.8,
      transportation: 4.6,
      security: 4.4,
      education: 4.7,
      health: 4.3,
      overall: 4.5,
    },
    negativeFactors: {
      uncontrolledMigration: 5.0,
      informalSettlement: 4.5,
      crimeRate: 4.0,
      trafficCongestion: 6.0,
      noisePollution: 6.5,
    },
    trendData: [4.2, 4.3, 4.4, 4.5],
    recommendedActions: [
      { action: "Sahil düzenleme projesi", potentialScore: 1.9, priority: "high", budget: "₺12M" },
      { action: "Yeşil alan artırımı", potentialScore: 1.7, priority: "high", budget: "₺6M" },
      { action: "Sosyal tesis yapımı", potentialScore: 1.5, priority: "medium", budget: "₺8M" },
    ],
  },
  {
    id: 10,
    name: "Gaziemir",
    coordinates: [38.3292, 27.1417],
    radius: 750,
    scores: {
      infrastructure: 3.5,
      environment: 3.2,
      social: 3.8,
      transportation: 3.6,
      security: 3.4,
      education: 3.7,
      health: 3.3,
      overall: 3.5,
    },
    negativeFactors: {
      uncontrolledMigration: 5.5,
      informalSettlement: 5.0,
      crimeRate: 4.5,
      trafficCongestion: 6.5,
      noisePollution: 7.0,
    },
    trendData: [3.2, 3.3, 3.4, 3.5],
    recommendedActions: [
      { action: "Serbest bölge altyapı yenileme", potentialScore: 2.0, priority: "high", budget: "₺18M" },
      { action: "Havalimanı bağlantı yolları", potentialScore: 1.8, priority: "high", budget: "₺30M" },
      { action: "Yeşil alan projesi", potentialScore: 1.6, priority: "medium", budget: "₺5M" },
    ],
  },
];

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
