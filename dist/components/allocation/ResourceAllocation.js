import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Badge } from "../ui/badge.js";
import { Checkbox } from "../ui/checkbox.js";
import { Label } from "../ui/label.js";
import { Calculator, CheckCircle2, AlertTriangle, Coins, } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, } from "recharts";
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
export const ResourceAllocation = ({ districts }) => {
    const [totalBudget, setTotalBudget] = useState(100000000);
    const [selectedDistricts, setSelectedDistricts] = useState(districts.map((d) => d.id));
    const [allocationResults, setAllocationResults] = useState(null);
    const toggleDistrict = (id) => {
        setSelectedDistricts((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
    };
    const calculateAllocation = () => {
        const selected = districts.filter((d) => selectedDistricts.includes(d.id));
        const totalNeed = selected.reduce((sum, d) => sum + (10 - d.scores.overall), 0);
        const results = selected.map((d) => {
            const need = 10 - d.scores.overall;
            const percentage = (need / totalNeed) * 100;
            const allocation = (percentage / 100) * totalBudget;
            const bestAction = d.recommendedActions.length > 0
                ? d.recommendedActions.reduce((best, curr) => curr.potentialScore > best.potentialScore ? curr : best)
                : { potentialScore: 0 };
            return {
                districtName: d.name,
                allocation,
                percentage,
                expectedImprovement: bestAction.potentialScore,
                priority: d.scores.overall < 5
                    ? "high"
                    : d.scores.overall < 7
                        ? "medium"
                        : "low",
            };
        });
        setAllocationResults(results.sort((a, b) => b.allocation - a.allocation));
    };
    const formatCurrency = (value) => new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(value);
    const pieData = allocationResults?.map((r) => ({
        name: r.districtName,
        value: Number(r.percentage.toFixed(2)),
    })) || [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "glass-card p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Coins, { className: "w-6 h-6 text-primary" }), _jsx("h3", { className: "text-lg font-bold", children: "Kaynak Da\u011F\u0131t\u0131m\u0131 Optimizasyonu" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx(Label, { children: "Toplam B\u00FCt\u00E7e (TL)" }), _jsx(Input, { type: "number", value: totalBudget, onChange: (e) => setTotalBudget(Number(e.target.value)) }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: formatCurrency(totalBudget) })] }), _jsxs("div", { children: [_jsx(Label, { children: "Dahil Edilecek B\u00F6lgeler" }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: districts.map((d) => (_jsxs("div", { className: "flex items-center gap-2 px-3 py-1 border rounded-lg", children: [_jsx(Checkbox, { checked: selectedDistricts.includes(d.id), onCheckedChange: () => toggleDistrict(d.id) }), _jsx("span", { className: "text-sm", children: d.name })] }, d.id))) })] })] }), _jsxs(Button, { onClick: calculateAllocation, className: "gap-2", children: [_jsx(Calculator, { className: "w-4 h-4" }), "Da\u011F\u0131t\u0131m\u0131 Hesapla"] })] }), allocationResults && (_jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "glass-card p-6 overflow-hidden", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "B\u00FCt\u00E7e Da\u011F\u0131l\u0131m\u0131" }), _jsx("div", { className: "h-[360px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: pieData, dataKey: "value", cx: "50%", cy: "45%", outerRadius: 110, label: false, children: pieData.map((_, i) => (_jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))) }), _jsx(Tooltip, { formatter: (v) => [`%${v}`, "Pay"] }), _jsx(Legend, { layout: "horizontal", verticalAlign: "bottom", align: "center", wrapperStyle: {
                                                    maxHeight: 80,
                                                    overflowY: "auto",
                                                    fontSize: 12,
                                                } })] }) }) })] }), _jsxs("div", { className: "glass-card p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Da\u011F\u0131t\u0131m Detaylar\u0131" }), _jsx("div", { className: "space-y-3 max-h-[360px] overflow-y-auto pr-2", children: allocationResults.map((r, i) => (_jsxs("div", { className: "p-3 border rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "font-semibold", children: r.districtName }), _jsx(Badge, { children: r.priority })] }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [formatCurrency(r.allocation), " \u2014 +", r.expectedImprovement, " puan"] })] }, r.districtName))) })] })] })), allocationResults && (_jsxs("div", { className: "glass-card p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-500" }), _jsx("h3", { className: "font-bold", children: "Notlar" })] }), _jsxs("ul", { className: "text-sm space-y-2 text-muted-foreground", children: [_jsxs("li", { className: "flex gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-green-500" }), "Da\u011F\u0131t\u0131m ihtiya\u00E7 bazl\u0131d\u0131r."] }), _jsxs("li", { className: "flex gap-2", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-green-500" }), "D\u00FC\u015F\u00FCk skorlar \u00F6nceliklidir."] })] })] }))] }));
};
