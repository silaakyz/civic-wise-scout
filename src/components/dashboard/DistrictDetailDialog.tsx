import { District, getScoreColor } from "@/lib/district";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Leaf,
  Users,
  Bus,
  Shield,
  GraduationCap,
  Heart,
  TrendingUp,
  AlertTriangle,
  Target,
  MapPin,
  BarChart3,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

interface DistrictDetailDialogProps {
  district: District | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const scoreIcons = {
  infrastructure: Building2,
  environment: Leaf,
  social: Users,
  transportation: Bus,
  security: Shield,
  education: GraduationCap,
  health: Heart,
};

const scoreLabels: Record<string, string> = {
  infrastructure: "Altyapı",
  environment: "Çevre",
  social: "Sosyal",
  transportation: "Ulaşım",
  security: "Güvenlik",
  education: "Eğitim",
  health: "Sağlık",
};

const negativeLabels: Record<string, string> = {
  uncontrolledMigration: "Kontrolsüz Göç",
  informalSettlement: "Kaçak Yapılaşma",
  crimeRate: "Suç Oranı",
  trafficCongestion: "Trafik Yoğunluğu",
  noisePollution: "Gürültü Kirliliği",
};

const priorityColors = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const priorityLabels = {
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
};

export const DistrictDetailDialog = ({
  district,
  open,
  onOpenChange,
}: DistrictDetailDialogProps) => {
  if (!district) return null;

  const scoreColor = getScoreColor(district.scores.overall);

  // Prepare radar chart data
  const radarData = Object.entries(district.scores)
    .filter(([key]) => key !== "overall")
    .map(([key, value]) => ({
      category: scoreLabels[key] || key,
      value: value,
      fullMark: 10,
    }));

  // Prepare trend data
  const trendData = district.trendData.map((value, index) => ({
    period: `Q${index + 1}`,
    score: value,
  }));

  // Prepare negative factors data
  const negativeData = Object.entries(district.negativeFactors).map(
    ([key, value]) => ({
      factor: negativeLabels[key] || key,
      value: value,
      key,
    })
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <MapPin className="w-5 h-5" style={{ color: scoreColor }} />
            <span>{district.name}</span>
            <Badge
              variant="outline"
              className="ml-auto text-lg px-3 py-1"
              style={{ borderColor: scoreColor, color: scoreColor }}
            >
              {district.scores.overall.toFixed(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="scores" className="text-xs sm:text-sm">
              Skorlar
            </TabsTrigger>
            <TabsTrigger value="negative" className="text-xs sm:text-sm">
              Risk Faktörleri
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs sm:text-sm">
              Öneriler
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Radar Chart */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Kategori Analizi
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 10]}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                      />
                      <Radar
                        name="Skor"
                        dataKey="value"
                        stroke={scoreColor}
                        fill={scoreColor}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trend Analizi
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={scoreColor} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={scoreColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="period"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        domain={[0, 10]}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke={scoreColor}
                        fill="url(#trendGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: scoreColor }}>
                  {district.scores.overall.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Genel Skor</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {district.recommendedActions.length}
                </div>
                <div className="text-xs text-muted-foreground">Öneri Sayısı</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  +{(district.trendData[3] - district.trendData[0]).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Trend Değişimi</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {Object.values(district.negativeFactors)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Toplam Risk</div>
              </div>
            </div>
          </TabsContent>

          {/* Scores Tab */}
          <TabsContent value="scores" className="space-y-3 mt-4">
            {Object.entries(district.scores)
              .filter(([key]) => key !== "overall")
              .map(([key, value]) => {
                const Icon = scoreIcons[key as keyof typeof scoreIcons];
                const color = getScoreColor(value);
                return (
                  <div
                    key={key}
                    className="bg-muted/30 rounded-lg p-3 flex items-center gap-3"
                  >
                    {Icon && (
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {scoreLabels[key]}
                        </span>
                        <span className="text-sm font-bold" style={{ color }}>
                          {value.toFixed(1)}
                        </span>
                      </div>
                      <Progress
                        value={value * 10}
                        className="h-2"
                        style={
                          {
                            ["--progress-background" as string]: color,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </TabsContent>

          {/* Negative Factors Tab */}
          <TabsContent value="negative" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-amber-400 mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                Risk faktörleri yüksek değerler olumsuz durumu gösterir (0-10
                ölçeği)
              </span>
            </div>
            {negativeData.map(({ factor, value, key }) => {
              const severity =
                value >= 5 ? "destructive" : value >= 3 ? "amber" : "emerald";
              const severityColor =
                severity === "destructive"
                  ? "hsl(var(--destructive))"
                  : severity === "amber"
                  ? "#f59e0b"
                  : "#10b981";

              return (
                <div
                  key={key}
                  className="bg-muted/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${severityColor}20` }}
                  >
                    <AlertTriangle className="w-5 h-5" style={{ color: severityColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{factor}</span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: severityColor }}
                      >
                        {value.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={value * 10}
                      className="h-2"
                      style={
                        {
                          ["--progress-background" as string]: severityColor,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Target className="w-4 h-4" />
              <span className="text-sm">
                Önerilen aksiyonlar ve potansiyel etkileri
              </span>
            </div>
            {district.recommendedActions.map((action, index) => (
              <div
                key={index}
                className="bg-muted/30 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{action.action}</span>
                  <Badge
                    variant="outline"
                    className={priorityColors[action.priority]}
                  >
                    {priorityLabels[action.priority]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    Potansiyel: +{action.potentialScore.toFixed(1)} puan
                  </span>
                  <span className="font-semibold text-primary">
                    {action.budget}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
