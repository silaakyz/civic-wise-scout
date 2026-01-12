import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { getScoreColor, districtData } from "../../data/districtData.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "../ui/dialog.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select.js";
import { Button } from "../ui/button.js";
import { Progress } from "../ui/progress.js";
import { Badge } from "../ui/badge.js";
import { Building2, Leaf, Users, Bus, Shield, GraduationCap, Heart, ArrowLeftRight, TrendingUp, TrendingDown, Minus, GitCompare, } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, } from "recharts";
const scoreIcons = {
    infrastructure: Building2,
    environment: Leaf,
    social: Users,
    transportation: Bus,
    security: Shield,
    education: GraduationCap,
    health: Heart,
};
const scoreLabels = {
    infrastructure: "Altyapı",
    environment: "Çevre",
    social: "Sosyal",
    transportation: "Ulaşım",
    security: "Güvenlik",
    education: "Eğitim",
    health: "Sağlık",
};
const negativeLabels = {
    uncontrolledMigration: "Kontrolsüz Göç",
    informalSettlement: "Kaçak Yapılaşma",
    crimeRate: "Suç Oranı",
    trafficCongestion: "Trafik Yoğunluğu",
    noisePollution: "Gürültü Kirliliği",
};
export const DistrictComparisonDialog = ({ trigger }) => {
    const [open, setOpen] = useState(false);
    const [district1Id, setDistrict1Id] = useState("");
    const [district2Id, setDistrict2Id] = useState("");
    const district1 = districtData.find((d) => d.id.toString() === district1Id);
    const district2 = districtData.find((d) => d.id.toString() === district2Id);
    const color1 = district1 ? getScoreColor(district1.scores.overall) : "#3b82f6";
    const color2 = district2 ? getScoreColor(district2.scores.overall) : "#8b5cf6";
    // Prepare radar chart data
    const radarData = district1 && district2
        ? Object.keys(scoreLabels).map((key) => ({
            category: scoreLabels[key],
            [district1.name]: district1.scores[key],
            [district2.name]: district2.scores[key],
        }))
        : [];
    // Prepare bar chart data for comparison
    const comparisonData = district1 && district2
        ? Object.keys(scoreLabels).map((key) => ({
            category: scoreLabels[key],
            value1: district1.scores[key],
            value2: district2.scores[key],
            diff: district1.scores[key] -
                district2.scores[key],
        }))
        : [];
    const getDiffIcon = (diff) => {
        if (diff > 0.5)
            return _jsx(TrendingUp, { className: "w-3 h-3 text-emerald-400" });
        if (diff < -0.5)
            return _jsx(TrendingDown, { className: "w-3 h-3 text-red-400" });
        return _jsx(Minus, { className: "w-3 h-3 text-muted-foreground" });
    };
    const getDiffColor = (diff) => {
        if (diff > 0.5)
            return "text-emerald-400";
        if (diff < -0.5)
            return "text-red-400";
        return "text-muted-foreground";
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: trigger || (_jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [_jsx(GitCompare, { className: "w-4 h-4" }), "Kar\u015F\u0131la\u015Ft\u0131r"] })) }), _jsxs(DialogContent, { className: "max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(ArrowLeftRight, { className: "w-5 h-5 text-primary" }), "\u0130l\u00E7e Kar\u015F\u0131la\u015Ft\u0131rma"] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "1. \u0130l\u00E7e" }), _jsxs(Select, { value: district1Id, onValueChange: setDistrict1Id, children: [_jsx(SelectTrigger, { className: "bg-background", children: _jsx(SelectValue, { placeholder: "\u0130l\u00E7e se\u00E7in" }) }), _jsx(SelectContent, { className: "bg-popover z-50 max-h-64", children: districtData.map((d) => (_jsxs(SelectItem, { value: d.id.toString(), disabled: d.id.toString() === district2Id, children: [d.name, " (", d.scores.overall.toFixed(1), ")"] }, d.id))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "2. \u0130l\u00E7e" }), _jsxs(Select, { value: district2Id, onValueChange: setDistrict2Id, children: [_jsx(SelectTrigger, { className: "bg-background", children: _jsx(SelectValue, { placeholder: "\u0130l\u00E7e se\u00E7in" }) }), _jsx(SelectContent, { className: "bg-popover z-50 max-h-64", children: districtData.map((d) => (_jsxs(SelectItem, { value: d.id.toString(), disabled: d.id.toString() === district1Id, children: [d.name, " (", d.scores.overall.toFixed(1), ")"] }, d.id))) })] })] })] }), district1 && district2 ? (_jsxs("div", { className: "space-y-6 mt-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-muted/30 rounded-lg p-4 text-center border-2", style: { borderColor: color1 }, children: [_jsx("h3", { className: "font-semibold mb-2", style: { color: color1 }, children: district1.name }), _jsx("div", { className: "text-4xl font-bold", style: { color: color1 }, children: district1.scores.overall.toFixed(1) }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Genel Skor" })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-4 text-center border-2", style: { borderColor: color2 }, children: [_jsx("h3", { className: "font-semibold mb-2", style: { color: color2 }, children: district2.name }), _jsx("div", { className: "text-4xl font-bold", style: { color: color2 }, children: district2.scores.overall.toFixed(1) }), _jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Genel Skor" })] })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Kategori Kar\u015F\u0131la\u015Ft\u0131rmas\u0131" }), _jsx("div", { className: "h-[280px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadarChart, { data: radarData, children: [_jsx(PolarGrid, { stroke: "hsl(var(--border))" }), _jsx(PolarAngleAxis, { dataKey: "category", tick: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 10], tick: { fill: "hsl(var(--muted-foreground))", fontSize: 9 } }), _jsx(Radar, { name: district1.name, dataKey: district1.name, stroke: color1, fill: color1, fillOpacity: 0.3 }), _jsx(Radar, { name: district2.name, dataKey: district2.name, stroke: color2, fill: color2, fillOpacity: 0.3 }), _jsx(Legend, {})] }) }) })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Detayl\u0131 Skor Kar\u015F\u0131la\u015Ft\u0131rmas\u0131" }), _jsx("div", { className: "space-y-3", children: comparisonData.map((item) => {
                                            const Icon = scoreIcons[Object.keys(scoreLabels).find((k) => scoreLabels[k] === item.category)];
                                            return (_jsxs("div", { className: "grid grid-cols-[1fr,auto,1fr] gap-2 items-center", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Progress, { value: item.value1 * 10, className: "h-2 flex-1", style: {
                                                                    ["--progress-background"]: color1,
                                                                } }), _jsx("span", { className: "text-sm font-medium w-10 text-right", style: { color: color1 }, children: item.value1.toFixed(1) })] }), _jsxs("div", { className: "flex items-center gap-1.5 min-w-[100px] justify-center", children: [Icon && _jsx(Icon, { className: "w-4 h-4 text-muted-foreground" }), _jsx("span", { className: "text-xs text-muted-foreground", children: item.category })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium w-10", style: { color: color2 }, children: item.value2.toFixed(1) }), _jsx(Progress, { value: item.value2 * 10, className: "h-2 flex-1", style: {
                                                                    ["--progress-background"]: color2,
                                                                } })] })] }, item.category));
                                        }) })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Fark \u00D6zeti" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: comparisonData.map((item) => (_jsxs("div", { className: "bg-background/50 rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: item.category }), _jsxs("div", { className: `flex items-center justify-center gap-1 font-semibold ${getDiffColor(item.diff)}`, children: [getDiffIcon(item.diff), _jsxs("span", { children: [item.diff > 0 ? "+" : "", item.diff.toFixed(1)] })] })] }, item.category))) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-3 text-center", children: ["Pozitif de\u011Ferler ", district1.name, "'nin daha iyi oldu\u011Funu g\u00F6sterir"] })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-semibold mb-3", children: "Risk Fakt\u00F6rleri Kar\u015F\u0131la\u015Ft\u0131rmas\u0131" }), _jsx("div", { className: "space-y-2", children: Object.keys(negativeLabels).map((key) => {
                                            const val1 = district1.negativeFactors[key];
                                            const val2 = district2.negativeFactors[key];
                                            const diff = val1 - val2;
                                            // For negative factors, lower is better, so we invert the diff interpretation
                                            const betterColor = diff < 0 ? color1 : diff > 0 ? color2 : "hsl(var(--muted-foreground))";
                                            return (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: negativeLabels[key] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Badge, { variant: "outline", style: { borderColor: color1, color: color1 }, children: val1.toFixed(1) }), _jsx("span", { className: "text-xs text-muted-foreground", children: "vs" }), _jsx(Badge, { variant: "outline", style: { borderColor: color2, color: color2 }, children: val2.toFixed(1) })] })] }, key));
                                        }) }), _jsx("p", { className: "text-xs text-muted-foreground mt-3 text-center", children: "Risk fakt\u00F6rlerinde d\u00FC\u015F\u00FCk de\u011Ferler daha iyidir" })] })] })) : (_jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [_jsx(GitCompare, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "Kar\u015F\u0131la\u015Ft\u0131rmak i\u00E7in iki il\u00E7e se\u00E7in" })] }))] })] }));
};
