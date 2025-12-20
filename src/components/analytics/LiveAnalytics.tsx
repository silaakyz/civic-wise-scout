import { useState, useEffect } from "react";
import { District, getScoreColor } from "@/data/districtData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
} from "recharts";
import { Activity, TrendingUp, Clock, BarChart3, Play, Pause, RotateCcw } from "lucide-react";

interface LiveAnalyticsProps {
  districts: District[];
}

// Generate historical data for the past 12 months
const generateHistoricalData = (districts: District[]) => {
  const months = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"
  ];

  return months.map((month, index) => {
    const baseData: Record<string, number | string> = { month };
    
    districts.forEach((district) => {
      // Simulate historical progression toward current score
      const variance = (Math.random() - 0.5) * 0.8;
      const progression = (index / 11) * 0.5; // gradual improvement
      const historicalScore = Math.max(
        1,
        Math.min(10, district.scores.overall - (1 - progression) * 1.5 + variance)
      );
      baseData[district.name] = Number(historicalScore.toFixed(2));
    });

    return baseData;
  });
};

// Generate real-time simulation data
const generateRealtimePoint = (districts: District[], currentData: any[]) => {
  const now = new Date();
  const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
  const newPoint: Record<string, number | string> = { time: timeLabel };
  
  districts.forEach((district) => {
    const lastValue = currentData.length > 0 
      ? (currentData[currentData.length - 1][district.name] as number) || district.scores.overall
      : district.scores.overall;
    
    // Small random fluctuation around current score
    const fluctuation = (Math.random() - 0.5) * 0.3;
    const newValue = Math.max(1, Math.min(10, lastValue + fluctuation));
    newPoint[district.name] = Number(newValue.toFixed(2));
  });

  return newPoint;
};

export const LiveAnalytics = ({ districts }: LiveAnalyticsProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [historicalData] = useState(() => generateHistoricalData(districts));
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [comparisonMode, setComparisonMode] = useState<"year" | "quarter">("year");

  // Real-time data simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setRealtimeData((prev) => {
        const newPoint = generateRealtimePoint(districts, prev);
        const updated = [...prev, newPoint];
        // Keep only last 20 points
        return updated.slice(-20);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, districts]);

  // Initialize with some data points
  useEffect(() => {
    const initialPoints: any[] = [];
    for (let i = 0; i < 10; i++) {
      initialPoints.push(generateRealtimePoint(districts, initialPoints));
    }
    setRealtimeData(initialPoints);
  }, [districts]);

  const resetRealtime = () => {
    setRealtimeData([]);
  };

  const getDistrictColors = () => {
    const colors: Record<string, string> = {};
    districts.forEach((d) => {
      colors[d.name] = getScoreColor(d.scores.overall);
    });
    return colors;
  };

  const districtColors = getDistrictColors();

  const filteredDistricts = selectedDistrict === "all" 
    ? districts 
    : districts.filter((d) => d.name === selectedDistrict);

  // Calculate quarterly comparison data
  const quarterlyData = [
    { quarter: "Q1 2024", ...Object.fromEntries(districts.map((d) => [d.name, d.trendData[0]])) },
    { quarter: "Q2 2024", ...Object.fromEntries(districts.map((d) => [d.name, d.trendData[1]])) },
    { quarter: "Q3 2024", ...Object.fromEntries(districts.map((d) => [d.name, d.trendData[2]])) },
    { quarter: "Q4 2024", ...Object.fromEntries(districts.map((d) => [d.name, d.trendData[3]])) },
  ];

  // Calculate year-over-year comparison
  const yoyData = districts.map((d) => ({
    name: d.name,
    "2023": d.scores.overall - (Math.random() * 0.5 + 0.3),
    "2024": d.scores.overall,
    change: ((d.scores.overall - (d.scores.overall - 0.4)) / (d.scores.overall - 0.4) * 100),
  })).sort((a, b) => b["2024"] - a["2024"]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="glass-card p-6 animate-fade-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Canlı Veri Görselleştirme
              </h3>
              <p className="text-sm text-muted-foreground">
                Gerçek zamanlı metrikler ve tarihsel karşılaştırmalar
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-40">
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

            <div className="flex items-center gap-2">
              <Badge
                variant={isLive ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? "bg-score-excellent animate-pulse" : "bg-muted-foreground"}`} />
                {isLive ? "Canlı" : "Durduruldu"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Chart */}
      <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-bold text-foreground">Gerçek Zamanlı İzleme</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="gap-1"
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isLive ? "Durdur" : "Başlat"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetRealtime}
              className="gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Sıfırla
            </Button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              {filteredDistricts.map((district) => (
                <Line
                  key={district.id}
                  type="monotone"
                  dataKey={district.name}
                  stroke={districtColors[district.name]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Comparison Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold text-foreground">Yıllık Trend</h4>
            </div>
            <Badge variant="secondary">12 Ay</Badge>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  {filteredDistricts.map((district) => (
                    <linearGradient
                      key={district.id}
                      id={`gradient-${district.name}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={districtColors[district.name]}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={districtColors[district.name]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {filteredDistricts.map((district) => (
                  <Area
                    key={district.id}
                    type="monotone"
                    dataKey={district.name}
                    stroke={districtColors[district.name]}
                    fill={`url(#gradient-${district.name})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Comparison */}
        <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold text-foreground">Çeyreklik Karşılaştırma</h4>
            </div>
            <Badge variant="secondary">2024</Badge>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="quarter"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {filteredDistricts.slice(0, 5).map((district) => (
                  <Bar
                    key={district.id}
                    dataKey={district.name}
                    fill={districtColors[district.name]}
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Year-over-Year Comparison */}
      <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-bold text-foreground">Yıllık Karşılaştırma (2023 vs 2024)</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {yoyData.slice(0, 10).map((item, index) => (
            <div
              key={item.name}
              className="p-4 rounded-xl border border-border bg-background/50 hover:bg-background/80 transition-all"
              style={{ animationDelay: `${450 + index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-foreground">{item.name}</span>
                <Badge
                  variant={item["2024"] > item["2023"] ? "default" : "destructive"}
                  className="text-xs"
                >
                  {item["2024"] > item["2023"] ? "↑" : "↓"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">2023</span>
                  <span className="font-medium">{item["2023"].toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">2024</span>
                  <span className="font-bold text-primary">{item["2024"].toFixed(1)}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item["2024"] / 10) * 100}%`,
                      backgroundColor: getScoreColor(item["2024"]),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ortalama Skor", value: (districts.reduce((s, d) => s + d.scores.overall, 0) / districts.length).toFixed(2), trend: "+0.3" },
          { label: "En Yüksek", value: Math.max(...districts.map(d => d.scores.overall)).toFixed(1), trend: "+0.1" },
          { label: "En Düşük", value: Math.min(...districts.map(d => d.scores.overall)).toFixed(1), trend: "+0.2" },
          { label: "Değişkenlik", value: ((Math.max(...districts.map(d => d.scores.overall)) - Math.min(...districts.map(d => d.scores.overall))).toFixed(1)), trend: "-0.1" },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="glass-card p-4 animate-fade-up"
            style={{ animationDelay: `${500 + index * 50}ms` }}
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-score-excellent' : 'text-score-critical'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
