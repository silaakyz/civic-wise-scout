import { District } from "@/lib/district";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecommendationsPanelProps {
  districts: District[];
}

const priorityConfig = {
  high: {
    label: "Yüksek",
    icon: AlertCircle,
    className: "bg-score-critical/10 text-score-critical border-score-critical/20",
  },
  medium: {
    label: "Orta",
    icon: Clock,
    className: "bg-score-warning/10 text-score-warning border-score-warning/20",
  },
  low: {
    label: "Düşük",
    icon: CheckCircle2,
    className: "bg-score-good/10 text-score-good border-score-good/20",
  },
};

export const RecommendationsPanel = ({ districts }: RecommendationsPanelProps) => {
  // Get all high priority actions from low-scoring districts
  const priorityActions = districts
    .filter((d) => d.scores.overall < 7.0)
    .flatMap((d) =>
      d.recommendedActions
        .filter((a) => a.priority === "high")
        .map((action) => ({
          ...action,
          districtName: d.name,
          districtScore: d.scores.overall,
        }))
    )
    .sort((a, b) => b.potentialScore - a.potentialScore)
    .slice(0, 6);

  return (
    <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">
          Öncelikli Öneriler
        </h3>
        <Badge variant="secondary" className="text-xs">
          {priorityActions.length} Aksiyon
        </Badge>
      </div>

      <div className="space-y-4">
        {priorityActions.map((action, index) => {
          const config = priorityConfig[action.priority];
          const Icon = config.icon;

          return (
            <div
              key={`${action.districtName}-${index}`}
              className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", config.className)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {action.districtName}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {action.budget}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {action.action}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-score-excellent font-medium">
                      +{action.potentialScore.toFixed(1)} puan
                    </span>
                    <span className="text-muted-foreground">
                      Mevcut: {action.districtScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
