import { useState } from "react";
import { District } from "@/lib/district";
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
  const [totalBudget, setTotalBudget] = useState(100000000);
  const [selectedDistricts, setSelectedDistricts] = useState(
    districts.map((d) => d.id)
  );
  const [allocationResults, setAllocationResults] =
    useState<AllocationResult[] | null>(null);

  const toggleDistrict = (id: number) => {
    setSelectedDistricts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const calculateAllocation = () => {
    const selected = districts.filter((d) =>
      selectedDistricts.includes(d.id)
    );

    const totalNeed = selected.reduce(
      (sum, d) => sum + (10 - d.scores.overall),
      0
    );

    const results: AllocationResult[] = selected.map((d) => {
      const need = 10 - d.scores.overall;
      const percentage = (need / totalNeed) * 100;
      const allocation = (percentage / 100) * totalBudget;

      const bestAction =
        d.recommendedActions.length > 0
          ? d.recommendedActions.reduce((best, curr) =>
              curr.potentialScore > best.potentialScore ? curr : best
            )
          : { potentialScore: 0 };

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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(value);

  const pieData =
    allocationResults?.map((r) => ({
      name: r.districtName,
      value: Number(r.percentage.toFixed(2)),
    })) || [];

  return (
    <div className="space-y-6">
      {/* ÜST KONTROLLER */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold">Kaynak Dağıtımı Optimizasyonu</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label>Toplam Bütçe (TL)</Label>
            <Input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(totalBudget)}
            </p>
          </div>

          <div>
            <Label>Dahil Edilecek Bölgeler</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {districts.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 px-3 py-1 border rounded-lg"
                >
                  <Checkbox
                    checked={selectedDistricts.includes(d.id)}
                    onCheckedChange={() => toggleDistrict(d.id)}
                  />
                  <span className="text-sm">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={calculateAllocation} className="gap-2">
          <Calculator className="w-4 h-4" />
          Dağıtımı Hesapla
        </Button>
      </div>

      {/* GRAFİK */}
      {allocationResults && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 overflow-hidden">
            <h3 className="text-lg font-bold mb-4">Bütçe Dağılımı</h3>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="45%"
                    outerRadius={110}
                    label={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(v: number) => [`%${v}`, "Pay"]}
                  />

                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      maxHeight: 80,
                      overflowY: "auto",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DETAY LİSTE */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Dağıtım Detayları</h3>
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {allocationResults.map((r, i) => (
                <div key={r.districtName} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{r.districtName}</span>
                    <Badge>{r.priority}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(r.allocation)} — +{r.expectedImprovement} puan
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {allocationResults && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold">Notlar</h3>
          </div>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Dağıtım ihtiyaç bazlıdır.
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Düşük skorlar önceliklidir.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
