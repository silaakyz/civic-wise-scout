import { useState } from "react";
import { District, getScoreColor, districtData } from "@/data/districtData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Leaf,
  Users,
  Bus,
  Shield,
  GraduationCap,
  Heart,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Minus,
  GitCompare,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

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

interface DistrictComparisonDialogProps {
  trigger?: React.ReactNode;
}

export const DistrictComparisonDialog = ({ trigger }: DistrictComparisonDialogProps) => {
  const [open, setOpen] = useState(false);
  const [district1Id, setDistrict1Id] = useState<string>("");
  const [district2Id, setDistrict2Id] = useState<string>("");

  const district1 = districtData.find((d) => d.id.toString() === district1Id);
  const district2 = districtData.find((d) => d.id.toString() === district2Id);

  const color1 = district1 ? getScoreColor(district1.scores.overall) : "#3b82f6";
  const color2 = district2 ? getScoreColor(district2.scores.overall) : "#8b5cf6";

  // Prepare radar chart data
  const radarData =
    district1 && district2
      ? Object.keys(scoreLabels).map((key) => ({
          category: scoreLabels[key],
          [district1.name]: district1.scores[key as keyof typeof district1.scores],
          [district2.name]: district2.scores[key as keyof typeof district2.scores],
        }))
      : [];

  // Prepare bar chart data for comparison
  const comparisonData =
    district1 && district2
      ? Object.keys(scoreLabels).map((key) => ({
          category: scoreLabels[key],
          value1: district1.scores[key as keyof typeof district1.scores],
          value2: district2.scores[key as keyof typeof district2.scores],
          diff:
            (district1.scores[key as keyof typeof district1.scores] as number) -
            (district2.scores[key as keyof typeof district2.scores] as number),
        }))
      : [];

  const getDiffIcon = (diff: number) => {
    if (diff > 0.5) return <TrendingUp className="w-3 h-3 text-emerald-400" />;
    if (diff < -0.5) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const getDiffColor = (diff: number) => {
    if (diff > 0.5) return "text-emerald-400";
    if (diff < -0.5) return "text-red-400";
    return "text-muted-foreground";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <GitCompare className="w-4 h-4" />
            Karşılaştır
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
            İlçe Karşılaştırma
          </DialogTitle>
        </DialogHeader>

        {/* District Selectors */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">1. İlçe</label>
            <Select value={district1Id} onValueChange={setDistrict1Id}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="İlçe seçin" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-64">
                {districtData.map((d) => (
                  <SelectItem
                    key={d.id}
                    value={d.id.toString()}
                    disabled={d.id.toString() === district2Id}
                  >
                    {d.name} ({d.scores.overall.toFixed(1)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">2. İlçe</label>
            <Select value={district2Id} onValueChange={setDistrict2Id}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="İlçe seçin" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-64">
                {districtData.map((d) => (
                  <SelectItem
                    key={d.id}
                    value={d.id.toString()}
                    disabled={d.id.toString() === district1Id}
                  >
                    {d.name} ({d.scores.overall.toFixed(1)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comparison Content */}
        {district1 && district2 ? (
          <div className="space-y-6 mt-6">
            {/* Overall Score Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-muted/30 rounded-lg p-4 text-center border-2"
                style={{ borderColor: color1 }}
              >
                <h3 className="font-semibold mb-2" style={{ color: color1 }}>
                  {district1.name}
                </h3>
                <div className="text-4xl font-bold" style={{ color: color1 }}>
                  {district1.scores.overall.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Genel Skor</div>
              </div>
              <div
                className="bg-muted/30 rounded-lg p-4 text-center border-2"
                style={{ borderColor: color2 }}
              >
                <h3 className="font-semibold mb-2" style={{ color: color2 }}>
                  {district2.name}
                </h3>
                <div className="text-4xl font-bold" style={{ color: color2 }}>
                  {district2.scores.overall.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Genel Skor</div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Kategori Karşılaştırması</h4>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 10]}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    />
                    <Radar
                      name={district1.name}
                      dataKey={district1.name}
                      stroke={color1}
                      fill={color1}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name={district2.name}
                      dataKey={district2.name}
                      stroke={color2}
                      fill={color2}
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Score Comparison */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Detaylı Skor Karşılaştırması</h4>
              <div className="space-y-3">
                {comparisonData.map((item) => {
                  const Icon =
                    scoreIcons[
                      Object.keys(scoreLabels).find(
                        (k) => scoreLabels[k] === item.category
                      ) as keyof typeof scoreIcons
                    ];
                  return (
                    <div key={item.category} className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                      {/* District 1 Score */}
                      <div className="flex items-center gap-2">
                        <Progress
                          value={item.value1 * 10}
                          className="h-2 flex-1"
                          style={
                            {
                              ["--progress-background" as string]: color1,
                            } as React.CSSProperties
                          }
                        />
                        <span className="text-sm font-medium w-10 text-right" style={{ color: color1 }}>
                          {item.value1.toFixed(1)}
                        </span>
                      </div>

                      {/* Category Label */}
                      <div className="flex items-center gap-1.5 min-w-[100px] justify-center">
                        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>

                      {/* District 2 Score */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-10" style={{ color: color2 }}>
                          {item.value2.toFixed(1)}
                        </span>
                        <Progress
                          value={item.value2 * 10}
                          className="h-2 flex-1"
                          style={
                            {
                              ["--progress-background" as string]: color2,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difference Summary */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Fark Özeti</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {comparisonData.map((item) => (
                  <div
                    key={item.category}
                    className="bg-background/50 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                    <div className={`flex items-center justify-center gap-1 font-semibold ${getDiffColor(item.diff)}`}>
                      {getDiffIcon(item.diff)}
                      <span>
                        {item.diff > 0 ? "+" : ""}
                        {item.diff.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Pozitif değerler {district1.name}'nin daha iyi olduğunu gösterir
              </p>
            </div>

            {/* Negative Factors Comparison */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3">Risk Faktörleri Karşılaştırması</h4>
              <div className="space-y-2">
                {Object.keys(negativeLabels).map((key) => {
                  const val1 = district1.negativeFactors[key as keyof typeof district1.negativeFactors];
                  const val2 = district2.negativeFactors[key as keyof typeof district2.negativeFactors];
                  const diff = val1 - val2;
                  // For negative factors, lower is better, so we invert the diff interpretation
                  const betterColor = diff < 0 ? color1 : diff > 0 ? color2 : "hsl(var(--muted-foreground))";

                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{negativeLabels[key]}</span>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" style={{ borderColor: color1, color: color1 }}>
                          {val1.toFixed(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <Badge variant="outline" style={{ borderColor: color2, color: color2 }}>
                          {val2.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Risk faktörlerinde düşük değerler daha iyidir
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Karşılaştırmak için iki ilçe seçin</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
