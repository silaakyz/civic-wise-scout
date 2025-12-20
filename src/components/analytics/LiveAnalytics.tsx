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
const generateQuarterlyData = (districts: District[], year: string) => {
  const quarters = [`Q1 ${year}`, `Q2 ${year}`, `Q3 ${year}`, `Q4 ${year}`];
  return quarters.map((quarter, index) => {
    const baseData: Record<string, string | number> = { quarter };
    districts.forEach((district) => {
      const yearOffset = year === "2023" ? -0.6 : year === "2024" ? -0.3 : 0;
      const trend = index * 0.15;
      const variation = (Math.random() - 0.5) * 0.4;
      baseData[district.name] = Math.max(1, Math.min(10, district.scores.overall + yearOffset + trend + variation)).toFixed(1);
    });
    return baseData;
  });
};

// Year-over-year comparison
const generateYearComparison = (districts: District[]) => {
  return districts.map((district) => {
    const score2023 = Math.max(1, Math.min(10, district.scores.overall - 0.8 + (Math.random() - 0.5) * 0.4));
    const score2024 = Math.max(1, Math.min(10, district.scores.overall - 0.3 + (Math.random() - 0.5) * 0.3));
    const score2025 = district.scores.overall;
    return {
      name: district.name,
      "2023": score2023.toFixed(1),
      "2024": score2024.toFixed(1),
      "2025": score2025.toFixed(1),
    };
  });
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
  const [selectedYear, setSelectedYear] = useState<"2023" | "2024" | "2025">("2025");

  const monthlyData = generateMonthlyData(districts.filter((d) => selectedDistricts.includes(d.name)));
  const quarterlyData = generateQuarterlyData(districts.filter((d) => selectedDistricts.includes(d.name)), selectedYear);
  const yearComparison = generateYearComparison(districts);

  const filteredDistricts = districts.filter((d) => selectedDistricts.includes(d.name));

  // Calculate summary stats
  const avgScore2025 = districts.reduce((sum, d) => sum + d.scores.overall, 0) / districts.length;
  const avgScore2024 = yearComparison.reduce((sum, d) => sum + parseFloat(d["2024"]), 0) / yearComparison.length;
  const avgScore2023 = yearComparison.reduce((sum, d) => sum + parseFloat(d["2023"]), 0) / yearComparison.length;
  const yearOverYearChange = ((avgScore2025 - avgScore2024) / avgScore2024 * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Veri Analizi</h2>
          <p className="text-muted-foreground">
            Aylık trendler ve yıllık karşılaştırmalar (2023-2025)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={viewMode} onValueChange={(v: "monthly" | "quarterly") => setViewMode(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Aylık Görünüm</SelectItem>
              <SelectItem value="quarterly">Çeyreklik Görünüm</SelectItem>
            </SelectContent>
          </Select>

          {viewMode === "quarterly" && (
            <Select value={selectedYear} onValueChange={(v: "2023" | "2024" | "2025") => setSelectedYear(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          )}

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2025 Ortalaması</p>
                <p className="text-2xl font-bold text-primary">{avgScore2025.toFixed(1)}</p>
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
                <p className="text-sm text-muted-foreground">2024 Ortalaması</p>
                <p className="text-2xl font-bold text-foreground">{avgScore2024.toFixed(1)}</p>
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
                <p className="text-sm text-muted-foreground">2023 Ortalaması</p>
                <p className="text-2xl font-bold text-foreground">{avgScore2023.toFixed(1)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
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
            {viewMode === "monthly" ? "Aylık Trend Analizi (2025)" : `Çeyreklik Performans (${selectedYear})`}
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
            2023 - 2024 - 2025 Karşılaştırması
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
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
                <Bar dataKey="2024" fill="hsl(var(--secondary))" name="2024" radius={[0, 4, 4, 0]} />
                <Bar dataKey="2025" fill="hsl(var(--primary))" name="2025" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {yearComparison.slice(0, 10).map((district, index) => {
          const change2425 = parseFloat(district["2025"]) - parseFloat(district["2024"]);
          const isPositive = change2425 > 0;
          return (
            <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-3">{district.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2023:</span>
                    <span className="font-medium">{district["2023"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2024:</span>
                    <span className="font-medium">{district["2024"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2025:</span>
                    <span className="font-bold text-primary">{district["2025"]}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 mt-3 text-sm ${isPositive ? "text-score-high" : "text-score-low"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isPositive ? "+" : ""}{change2425.toFixed(2)} (2024→2025)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
