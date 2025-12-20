import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { District } from "@/data/districtData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

interface LiveAnalyticsProps {
  districts: District[];
}

// Monthly historical data for 12 months
const generateMonthlyData = (districts: District[]) => {
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return months.map((month, index) => {
    const baseData: Record<string, string | number> = { month };
    districts.forEach((district) => {
      const variation = Math.sin((index / 12) * Math.PI * 2) * 0.5 + (Math.random() - 0.5) * 0.3;
      baseData[district.name] = Math.max(1, Math.min(10, district.scores.overall + variation)).toFixed(1);
    });
    return baseData;
  });
};

// Quarterly comparison data
const generateQuarterlyData = (districts: District[]) => {
  const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];
  return quarters.map((quarter, index) => {
    const baseData: Record<string, string | number> = { quarter };
    districts.forEach((district) => {
      const trend = index * 0.15;
      const variation = (Math.random() - 0.5) * 0.4;
      baseData[district.name] = Math.max(1, Math.min(10, district.scores.overall - 0.3 + trend + variation)).toFixed(1);
    });
    return baseData;
  });
};

// Year-over-year comparison
const generateYearComparison = (districts: District[]) => {
  return districts.map((district) => ({
    name: district.name,
    "2023": Math.max(1, Math.min(10, district.scores.overall - 0.5 + (Math.random() - 0.5) * 0.6)).toFixed(1),
    "2024": district.scores.overall.toFixed(1),
    change: ((district.scores.overall - (district.scores.overall - 0.5)) / (district.scores.overall - 0.5) * 100).toFixed(1),
  }));
};

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(187, 85%, 43%)",
  "hsl(200, 85%, 45%)",
  "hsl(160, 70%, 40%)",
  "hsl(280, 65%, 55%)",
  "hsl(45, 90%, 50%)",
];

export const LiveAnalytics = ({ districts }: LiveAnalyticsProps) => {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(
    districts.slice(0, 5).map((d) => d.name)
  );
  const [viewMode, setViewMode] = useState<"monthly" | "quarterly">("monthly");

  const monthlyData = generateMonthlyData(districts.filter((d) => selectedDistricts.includes(d.name)));
  const quarterlyData = generateQuarterlyData(districts.filter((d) => selectedDistricts.includes(d.name)));
  const yearComparison = generateYearComparison(districts);

  const filteredDistricts = districts.filter((d) => selectedDistricts.includes(d.name));

  // Calculate summary stats
  const avgScore2024 = districts.reduce((sum, d) => sum + d.scores.overall, 0) / districts.length;
  const avgScore2023 = yearComparison.reduce((sum, d) => sum + parseFloat(d["2023"]), 0) / yearComparison.length;
  const yearOverYearChange = ((avgScore2024 - avgScore2023) / avgScore2023 * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Veri Analizi</h2>
          <p className="text-muted-foreground">
            Aylık trendler ve yıllık karşılaştırmalar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(v: "monthly" | "quarterly") => setViewMode(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Aylık Görünüm</SelectItem>
              <SelectItem value="quarterly">Çeyreklik Görünüm</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedDistricts.length === districts.length ? "all" : "custom"}
            onValueChange={(v) => {
              if (v === "all") {
                setSelectedDistricts(districts.map((d) => d.name));
              } else {
                setSelectedDistricts(districts.slice(0, 5).map((d) => d.name));
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Bölge Seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Bölgeler</SelectItem>
              <SelectItem value="custom">İlk 5 Bölge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2024 Ortalaması</p>
                <p className="text-2xl font-bold text-foreground">{avgScore2024.toFixed(1)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2023 Ortalaması</p>
                <p className="text-2xl font-bold text-foreground">{avgScore2023.toFixed(1)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Yıllık Değişim</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    {parseFloat(yearOverYearChange) > 0 ? "+" : ""}
                    {yearOverYearChange}%
                  </p>
                  {parseFloat(yearOverYearChange) > 0 ? (
                    <TrendingUp className="w-5 h-5 text-score-high" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-score-low" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">İzlenen Bölge</p>
                <p className="text-2xl font-bold text-foreground">{selectedDistricts.length}</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {viewMode === "monthly" ? "12 Ay" : "4 Çeyrek"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {viewMode === "monthly" ? "Aylık Trend Analizi (2024)" : "Çeyreklik Performans (2024)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === "monthly" ? (
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[0, 10]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {filteredDistricts.map((district, index) => (
                    <Area
                      key={district.id}
                      type="monotone"
                      dataKey={district.name}
                      stroke={colors[index % colors.length]}
                      fill={colors[index % colors.length]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              ) : (
                <BarChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="quarter" className="text-xs" />
                  <YAxis domain={[0, 10]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {filteredDistricts.map((district, index) => (
                    <Bar
                      key={district.id}
                      dataKey={district.name}
                      fill={colors[index % colors.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Year-over-Year Comparison */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            2023 vs 2024 Karşılaştırması
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 10]} className="text-xs" />
                <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="2023" fill="hsl(var(--muted-foreground))" name="2023" radius={[0, 4, 4, 0]} />
                <Bar dataKey="2024" fill="hsl(var(--primary))" name="2024" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {yearComparison.slice(0, 10).map((district, index) => {
          const change = parseFloat(district["2024"]) - parseFloat(district["2023"]);
          const isPositive = change > 0;
          return (
            <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-2">{district.name}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">2023: </span>
                    <span className="font-medium">{district["2023"]}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">2024: </span>
                    <span className="font-bold text-primary">{district["2024"]}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? "text-score-high" : "text-score-low"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isPositive ? "+" : ""}{change.toFixed(2)} puan</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
