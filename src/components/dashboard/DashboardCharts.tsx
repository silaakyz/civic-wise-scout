import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, LineChart as LineChartIcon, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell,
} from "recharts";
import { District } from "@/lib/district";

interface DashboardChartsProps {
  districts: District[];
  allDistricts: District[];
}

const getScoreColor = (score: number) => {
  if (score >= 8) return "#10b981";
  if (score >= 6) return "#22c55e";
  if (score >= 5) return "#f59e0b";
  if (score >= 3) return "#f97316";
  return "#ef4444";
};

export const DashboardCharts = ({ districts, allDistricts }: DashboardChartsProps) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Prepare bar chart data
  const barChartData = districts.slice(0, 15).map((d) => ({
    name: d.name.length > 10 ? d.name.substring(0, 10) + "..." : d.name,
    fullName: d.name,
    score: d.scores.overall,
    color: getScoreColor(d.scores.overall),
  }));

  // Prepare trend data (simulated quarterly data)
  const trendData = [
    { quarter: "Q1 2024", infrastructure: 6.2, environment: 5.8, social: 6.5, transportation: 5.5 },
    { quarter: "Q2 2024", infrastructure: 6.5, environment: 6.0, social: 6.8, transportation: 5.8 },
    { quarter: "Q3 2024", infrastructure: 6.8, environment: 6.3, social: 7.0, transportation: 6.2 },
    { quarter: "Q4 2024", infrastructure: 7.0, environment: 6.5, social: 7.2, transportation: 6.5 },
  ];

  // Prepare radar data for selected or top district
  const getRadarData = (district: District) => [
    { category: "Altyapı", value: district.scores.infrastructure },
    { category: "Çevre", value: district.scores.environment },
    { category: "Sosyal", value: district.scores.social },
    { category: "Ulaşım", value: district.scores.transportation },
    { category: "Güvenlik", value: district.scores.security },
    { category: "Eğitim", value: district.scores.education },
    { category: "Sağlık", value: district.scores.health },
  ];

  // Area chart data for score distribution
  const distributionData = districts.map((d, i) => ({
    index: i + 1,
    name: d.name,
    score: d.scores.overall,
    average: allDistricts.reduce((sum, d) => sum + d.scores.overall, 0) / allDistricts.length,
  }));

  return (
    <div className="space-y-6">
      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Bölge Skorları
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Top 15
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={70}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [value.toFixed(2), "Skor"]}
                    labelFormatter={(label) => {
                      const item = barChartData.find((d) => d.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-primary" />
                Performans Trendi
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                2024
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                  <YAxis domain={[4, 8]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="infrastructure"
                    name="Altyapı"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="environment"
                    name="Çevre"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="social"
                    name="Sosyal"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transportation"
                    name="Ulaşım"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Skor Dağılımı
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Tüm Bölgeler
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={distributionData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="index" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelFormatter={(label) => {
                      const item = distributionData.find((d) => d.index === label);
                      return item?.name || `Bölge ${label}`;
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Skor"
                    stroke="#3b82f6"
                    fill="url(#scoreGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="average"
                    name="Ortalama"
                    stroke="#f59e0b"
                    fill="url(#avgGradient)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Kategori Analizi
              </CardTitle>
            </div>
            <Select
              value={selectedDistrict?.id?.toString() || allDistricts[0]?.id?.toString()}
              onValueChange={(value) => {
                const district = allDistricts.find((d) => d.id.toString() === value);
                setSelectedDistrict(district || null);
              }}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="İlçe seçin" />
              </SelectTrigger>
              <SelectContent className="max-h-64 bg-popover z-50">
                {allDistricts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()} className="text-xs">
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="radar" className="w-full">
              <TabsList className="w-full mb-2">
                <TabsTrigger value="radar" className="flex-1 text-xs">
                  Radar
                </TabsTrigger>
                <TabsTrigger value="list" className="flex-1 text-xs">
                  Liste
                </TabsTrigger>
              </TabsList>
              <TabsContent value="radar">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={getRadarData(selectedDistrict || districts[0])}
                    >
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fontSize: 9 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 10]}
                        tick={{ fontSize: 8 }}
                      />
                      <Radar
                        name="Skor"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-2 h-52 overflow-y-auto">
                  {getRadarData(selectedDistrict || districts[0]).map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                    >
                      <span className="text-xs">{item.category}</span>
                      <Badge
                        variant={item.value >= 7 ? "default" : item.value >= 5 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {item.value.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
