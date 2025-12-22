import { District, getScoreClass, getScoreColor } from "@/lib/district";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Leaf, 
  Users, 
  Bus, 
  Shield, 
  GraduationCap, 
  Heart,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DistrictScoreCardProps {
  district: District;
  rank: number;
  onClick?: () => void;
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

export const DistrictScoreCard = ({ district, rank, onClick }: DistrictScoreCardProps) => {
  const scoreClass = getScoreClass(district.scores.overall);
  const scoreColor = getScoreColor(district.scores.overall);

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-5 hover-lift cursor-pointer animate-fade-up",
        scoreClass
      )}
      style={{ animationDelay: `${rank * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-foreground" style={{ color: scoreColor }}>
            {district.name}
          </h4>
          <span className="text-xs text-muted-foreground">Sıralama: {rank}</span>
        </div>
        <div
          className="text-3xl font-bold"
          style={{ color: scoreColor }}
        >
          {district.scores.overall.toFixed(1)}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Genel Skor</span>
          <span>{(district.scores.overall * 10).toFixed(0)}%</span>
        </div>
        <Progress 
          value={district.scores.overall * 10} 
          className="h-2"
          style={{ 
            ['--progress-background' as string]: scoreColor 
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(district.scores)
          .filter(([key]) => key !== "overall")
          .slice(0, 6)
          .map(([key, value]) => {
            const Icon = scoreIcons[key as keyof typeof scoreIcons];
            return (
              <div
                key={key}
                className="flex items-center gap-2 text-xs"
                style={{ color: scoreColor }}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span className="truncate">{scoreLabels[key]}: {value.toFixed(1)}</span>
              </div>
            );
          })}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
        <TrendingUp className="w-4 h-4 text-score-excellent" />
        <span className="text-xs text-muted-foreground">
          Trend: {district.trendData[0].toFixed(1)} → {district.trendData[3].toFixed(1)}
        </span>
      </div>
    </div>
  );
};
