import { useState, useMemo } from "react";
import { District, criteriaWeights } from "@/lib/district";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RotateCcw,
  PlayCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  BarChart3,
  PieChart,
  Table2,
  Download,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ScenarioAnalysisProps {
  districts: District[];
}

type ScenarioResult = {
  name: string;
  original: number;
  scenario: number;
  change: number;
  changePercent: number;
};

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

  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[] | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

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
      const change = scenarioScore - d.scores.overall;
      return {
        name: d.name,
        original: d.scores.overall,
        scenario: scenarioScore,
        change,
        changePercent: (change / d.scores.overall) * 100,
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

  const filteredResults = useMemo(() => {
    if (!scenarioResults) return null;
    if (selectedDistrict === "all") return scenarioResults;
    return scenarioResults.filter((r) => r.name === selectedDistrict);
  }, [scenarioResults, selectedDistrict]);

  const summaryStats = useMemo(() => {
    if (!scenarioResults) return null;
    const avgOriginal = scenarioResults.reduce((a, b) => a + b.original, 0) / scenarioResults.length;
    const avgScenario = scenarioResults.reduce((a, b) => a + b.scenario, 0) / scenarioResults.length;
    const maxGain = Math.max(...scenarioResults.map((r) => r.change));
    const maxLoss = Math.min(...scenarioResults.map((r) => r.change));
    const improved = scenarioResults.filter((r) => r.change > 0).length;
    const declined = scenarioResults.filter((r) => r.change < 0).length;
    
    return {
      avgOriginal,
      avgScenario,
      avgChange: avgScenario - avgOriginal,
      maxGain,
      maxLoss,
      improved,
      declined,
      unchanged: scenarioResults.length - improved - declined,
    };
  }, [scenarioResults]);

  const pieData = useMemo(() => {
    if (!summaryStats) return [];
    return [
      { name: "Artan", value: summaryStats.improved, fill: "hsl(142, 71%, 45%)" },
      { name: "Azalan", value: summaryStats.declined, fill: "hsl(0, 72%, 51%)" },
      { name: "Sabit", value: summaryStats.unchanged, fill: "hsl(220, 14%, 50%)" },
    ];
  }, [summaryStats]);

  const weightDistributionData = useMemo(() => {
    return Object.entries(criteriaWeights).map(([key, config]) => ({
      name: config.name,
      value: weights[key as keyof typeof weights],
      fullMark: 30,
    }));
  }, [weights]);

  const getChangeColor = (change: number) => {
    if (change > 0.3) return "text-emerald-500";
    if (change > 0) return "text-green-400";
    if (change > -0.3) return "text-amber-500";
    return "text-red-500";
  };

  const getBarColor = (change: number) => {
    if (change > 0.3) return "hsl(142, 71%, 45%)";
    if (change > 0) return "hsl(142, 71%, 55%)";
    if (change > -0.3) return "hsl(45, 100%, 50%)";
    return "hsl(0, 72%, 51%)";
  };

  const ChangeIcon = ({ change }: { change: number }) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Power BI Style Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Senaryo Analizi</h2>
          <p className="text-sm text-muted-foreground">
            Kriter ağırlıklarını değiştirerek bölge performanslarını simüle edin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={resetWeights}>
            <RefreshCw className="w-4 h-4" />
            Sıfırla
          </Button>
          <Button size="sm" className="gap-2" onClick={runScenario}>
            <PlayCircle className="w-4 h-4" />
            Çalıştır
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {scenarioResults && summaryStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-up">
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-primary">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Ort. Orijinal</p>
            <p className="text-2xl font-bold mt-1">{summaryStats.avgOriginal.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-blue-500">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Ort. Senaryo</p>
            <p className="text-2xl font-bold mt-1">{summaryStats.avgScenario.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-emerald-500">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Artan Bölge</p>
            <p className="text-2xl font-bold mt-1 text-emerald-500">{summaryStats.improved}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-red-500">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Azalan Bölge</p>
            <p className="text-2xl font-bold mt-1 text-red-500">{summaryStats.declined}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-green-400">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Max Artış</p>
            <p className="text-2xl font-bold mt-1 text-green-400">+{summaryStats.maxGain.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-l-4 border-l-amber-500">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Max Düşüş</p>
            <p className="text-2xl font-bold mt-1 text-amber-500">{summaryStats.maxLoss.toFixed(2)}</p>
          </Card>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Panel - Filters/Sliders */}
        <div className="lg:col-span-3 space-y-4">
          {/* Weight Configuration Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Kriter Ağırlıkları</h3>
              </div>
              <Badge variant={totalWeight === 100 ? "secondary" : "destructive"} className="text-xs">
                %{totalWeight}
              </Badge>
            </div>
            <div className="space-y-4">
              {Object.entries(criteriaWeights).map(([key, config]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span>{config.icon}</span>
                      {config.name}
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {weights[key as keyof typeof weights]}%
                    </span>
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
          </Card>

          {/* Weight Distribution Radar */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Ağırlık Dağılımı
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={weightDistributionData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 30]} 
                    tick={{ fontSize: 8 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Radar
                    name="Ağırlık"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Panel - Charts */}
        <div className="lg:col-span-9 space-y-4">
          {!scenarioResults ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Senaryo Analizi Başlatın
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Sol panelden kriter ağırlıklarını ayarlayın ve "Çalıştır" butonuna tıklayarak
                senaryo sonuçlarını görüntüleyin.
              </p>
              <Button onClick={runScenario} className="gap-2">
                <PlayCircle className="w-4 h-4" />
                Senaryoyu Çalıştır
              </Button>
            </Card>
          ) : (
            <>
              {/* Chart Header with Controls */}
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Bölge Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Bölgeler</SelectItem>
                        {districts.map((d) => (
                          <SelectItem key={d.id} value={d.name}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "chart" | "table")}>
                      <TabsList className="h-9">
                        <TabsTrigger value="chart" className="gap-1.5 text-xs px-3">
                          <BarChart3 className="w-3.5 h-3.5" />
                          Grafik
                        </TabsTrigger>
                        <TabsTrigger value="table" className="gap-1.5 text-xs px-3">
                          <Table2 className="w-3.5 h-3.5" />
                          Tablo
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Button variant="outline" size="sm" className="h-9">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {viewMode === "chart" ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredResults}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                          type="number"
                          domain={[0, 10]}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={{ stroke: "hsl(var(--border))" }}
                          width={75}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                          formatter={(value: number, name: string) => [
                            value.toFixed(2),
                            name === "scenario" ? "Senaryo" : "Orijinal",
                          ]}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: 12 }}
                          formatter={(value) => value === "original" ? "Orijinal" : "Senaryo"}
                        />
                        <Bar 
                          dataKey="original" 
                          name="original"
                          fill="hsl(var(--muted))" 
                          radius={[0, 4, 4, 0]} 
                          barSize={14}
                        />
                        <Bar 
                          dataKey="scenario" 
                          name="scenario"
                          radius={[0, 4, 4, 0]}
                          barSize={14}
                        >
                          {filteredResults?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.change)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="overflow-auto max-h-[400px]">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-card">
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bölge</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Orijinal</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Senaryo</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Değişim</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults?.map((result, index) => (
                          <tr 
                            key={result.name} 
                            className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                              index % 2 === 0 ? "bg-muted/20" : ""
                            }`}
                          >
                            <td className="py-3 px-4 font-medium">{result.name}</td>
                            <td className="text-right py-3 px-4 font-mono">{result.original.toFixed(2)}</td>
                            <td className="text-right py-3 px-4 font-mono font-medium">{result.scenario.toFixed(2)}</td>
                            <td className={`text-right py-3 px-4 font-mono ${getChangeColor(result.change)}`}>
                              <span className="inline-flex items-center gap-1">
                                <ChangeIcon change={result.change} />
                                {result.change > 0 ? "+" : ""}{result.change.toFixed(2)}
                              </span>
                            </td>
                            <td className={`text-right py-3 px-4 font-mono ${getChangeColor(result.change)}`}>
                              {result.changePercent > 0 ? "+" : ""}{result.changePercent.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Bottom Row - Additional Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Distribution Pie */}
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Değişim Dağılımı</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Comparison Area Chart */}
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Orijinal vs Senaryo Karşılaştırması</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredResults?.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          domain={[0, 10]} 
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="original"
                          stroke="hsl(var(--muted-foreground))"
                          fill="hsl(var(--muted))"
                          fillOpacity={0.3}
                          name="Orijinal"
                        />
                        <Area
                          type="monotone"
                          dataKey="scenario"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          name="Senaryo"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
