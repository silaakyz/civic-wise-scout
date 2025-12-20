import { useState } from "react";
import { District } from "@/data/districtData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Coins,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface ResourceAllocationProps {
  districts: District[];
}

interface AllocationResult {
  districtName: string;
  allocation: number;
  percentage: number;
  expectedImprovement: number;
  priority: "high" | "medium" | "low";
}

const COLORS = [
  "#006064",
  "#00838f",
  "#0097a7",
  "#00acc1",
  "#00bcd4",
  "#26c6da",
  "#4dd0e1",
  "#80deea",
  "#b2ebf2",
  "#e0f7fa",
];

export const ResourceAllocation = ({ districts }: ResourceAllocationProps) => {
  const [totalBudget, setTotalBudget] = useState<number>(100000000);
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>(
    districts.map((d) => d.id)
  );
  const [allocationResults, setAllocationResults] = useState<
    AllocationResult[] | null
  >(null);

  const toggleDistrict = (id: number) => {
    setSelectedDistricts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const calculateAllocation = () => {
    const selected = districts.filter((d) => selectedDistricts.includes(d.id));
    
    // Inverse scoring - lower scores get more resources
    const totalNeed = selected.reduce(
      (sum, d) => sum + (10 - d.scores.overall),
      0
    );

    const results: AllocationResult[] = selected.map((d) => {
      const need = 10 - d.scores.overall;
      const percentage = (need / totalNeed) * 100;
      const allocation = (percentage / 100) * totalBudget;
      
      // Calculate expected improvement based on best action's potential
      const bestAction = d.recommendedActions.reduce(
        (best, current) =>
          current.potentialScore > best.potentialScore ? current : best,
        d.recommendedActions[0]
      );

      return {
        districtName: d.name,
        allocation,
        percentage,
        expectedImprovement: bestAction.potentialScore,
        priority:
          d.scores.overall < 5
            ? "high"
            : d.scores.overall < 7
            ? "medium"
            : "low",
      };
    });

    setAllocationResults(results.sort((a, b) => b.allocation - a.allocation));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const pieData =
    allocationResults?.map((r) => ({
      name: r.districtName,
      value: r.percentage,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 animate-fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Kaynak Dağıtımı Optimizasyonu
            </h3>
            <p className="text-sm text-muted-foreground">
              Bütçeyi ihtiyaca göre optimal olarak dağıtın
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <Label htmlFor="budget">Toplam Bütçe (TL)</Label>
            <Input
              id="budget"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="text-lg font-semibold"
            />
            <p className="text-sm text-muted-foreground">
              Mevcut: {formatCurrency(totalBudget)}
            </p>
          </div>

          <div className="space-y-3">
            <Label>Dahil Edilecek Bölgeler</Label>
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background/50"
                >
                  <Checkbox
                    id={`district-${d.id}`}
                    checked={selectedDistricts.includes(d.id)}
                    onCheckedChange={() => toggleDistrict(d.id)}
                  />
                  <Label
                    htmlFor={`district-${d.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {d.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={calculateAllocation}
          className="gap-2"
          disabled={selectedDistricts.length === 0}
        >
          <Calculator className="w-4 h-4" />
          Dağıtımı Hesapla
        </Button>
      </div>

      {allocationResults && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 animate-fade-up">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Dağıtım Grafiği
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: %${value.toFixed(1)}`}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`%${value.toFixed(1)}`, "Pay"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 animate-fade-up">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Dağıtım Detayları
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {allocationResults.map((result, index) => (
                <div
                  key={result.districtName}
                  className="p-4 rounded-xl border border-border bg-background/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-semibold text-foreground">
                        {result.districtName}
                      </span>
                    </div>
                    <Badge
                      variant={
                        result.priority === "high"
                          ? "destructive"
                          : result.priority === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {result.priority === "high"
                        ? "Yüksek Öncelik"
                        : result.priority === "medium"
                        ? "Orta Öncelik"
                        : "Düşük Öncelik"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tahsis</p>
                      <p className="font-bold text-primary">
                        {formatCurrency(result.allocation)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Beklenen İyileşme</p>
                      <p className="font-bold text-score-excellent flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />+
                        {result.expectedImprovement.toFixed(1)} puan
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {allocationResults && (
        <div className="glass-card p-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-score-warning" />
            <h3 className="text-lg font-bold text-foreground">
              Önemli Notlar
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-score-excellent mt-0.5" />
              Dağıtım, bölgelerin mevcut skorlarına göre ihtiyaç bazlı hesaplanmıştır.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-score-excellent mt-0.5" />
              Düşük skorlu bölgelere öncelik verilmiştir.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-score-excellent mt-0.5" />
              Beklenen iyileşme, en etkili aksiyon bazında hesaplanmıştır.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
