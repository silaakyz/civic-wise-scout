import { RotateCcw, Download, Maximize2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DistrictComparisonDialog } from "./DistrictComparisonDialog";

interface DashboardHeaderProps {
  onReset: () => void;
}

export const DashboardHeader = ({ onReset }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Kentsel Performans Gösterge Paneli
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              İzmir ili bölgesel performans analizi ve karar destek sistemi
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DistrictComparisonDialog />
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Son 30 Gün</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Sıfırla</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
