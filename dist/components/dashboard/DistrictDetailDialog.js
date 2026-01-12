import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getScoreColor } from "../../lib/district.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "../ui/dialog.js";
import { Progress } from "../ui/progress.js";
import { Badge } from "../ui/badge.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.js";
import { Building2, Leaf, Users, Bus, Shield, GraduationCap, Heart, TrendingUp, AlertTriangle, Target, MapPin, BarChart3, } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, } from "recharts";
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
export const DistrictDetailDialog = ({ district, open, onOpenChange, }) => {
    if (!district)
        return null;
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
    const negativeData = Object.entries(district.negativeFactors).map(([key, value]) => ({
        factor: negativeLabels[key] || key,
        value: value,
        key,
    }));
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "flex items-center gap-3 text-xl", children: [_jsx(MapPin, { className: "w-5 h-5", style: { color: scoreColor } }), _jsx("span", { children: district.name }), _jsx(Badge, { variant: "outline", className: "ml-auto text-lg px-3 py-1", style: { borderColor: scoreColor, color: scoreColor }, children: district.scores.overall.toFixed(1) })] }) }), _jsxs(Tabs, { defaultValue: "overview", className: "w-full mt-4", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4 bg-muted/50", children: [_jsx(TabsTrigger, { value: "overview", className: "text-xs sm:text-sm", children: "Genel Bak\u0131\u015F" }), _jsx(TabsTrigger, { value: "scores", className: "text-xs sm:text-sm", children: "Skorlar" }), _jsx(TabsTrigger, { value: "negative", className: "text-xs sm:text-sm", children: "Risk Fakt\u00F6rleri" }), _jsx(TabsTrigger, { value: "actions", className: "text-xs sm:text-sm", children: "\u00D6neriler" })] }), _jsxs(TabsContent, { value: "overview", className: "space-y-4 mt-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [_jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Kategori Analizi"] }), _jsx("div", { className: "h-[200px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RadarChart, { data: radarData, children: [_jsx(PolarGrid, { stroke: "hsl(var(--border))" }), _jsx(PolarAngleAxis, { dataKey: "category", tick: { fill: "hsl(var(--muted-foreground))", fontSize: 10 } }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 10], tick: { fill: "hsl(var(--muted-foreground))", fontSize: 9 } }), _jsx(Radar, { name: "Skor", dataKey: "value", stroke: scoreColor, fill: scoreColor, fillOpacity: 0.3 })] }) }) })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-4", children: [_jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-4 h-4" }), "Trend Analizi"] }), _jsx("div", { className: "h-[200px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: trendData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "trendGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: scoreColor, stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: scoreColor, stopOpacity: 0 })] }) }), _jsx(XAxis, { dataKey: "period", tick: { fill: "hsl(var(--muted-foreground))", fontSize: 11 }, axisLine: { stroke: "hsl(var(--border))" } }), _jsx(YAxis, { domain: [0, 10], tick: { fill: "hsl(var(--muted-foreground))", fontSize: 11 }, axisLine: { stroke: "hsl(var(--border))" } }), _jsx(Tooltip, { contentStyle: {
                                                                        backgroundColor: "hsl(var(--popover))",
                                                                        border: "1px solid hsl(var(--border))",
                                                                        borderRadius: "8px",
                                                                    } }), _jsx(Area, { type: "monotone", dataKey: "score", stroke: scoreColor, fill: "url(#trendGradient)", strokeWidth: 2 })] }) }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [_jsxs("div", { className: "bg-muted/30 rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold", style: { color: scoreColor }, children: district.scores.overall.toFixed(1) }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Genel Skor" })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary", children: district.recommendedActions.length }), _jsx("div", { className: "text-xs text-muted-foreground", children: "\u00D6neri Say\u0131s\u0131" })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-3 text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-emerald-400", children: ["+", (district.trendData[3] - district.trendData[0]).toFixed(1)] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Trend De\u011Fi\u015Fimi" })] }), _jsxs("div", { className: "bg-muted/30 rounded-lg p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-amber-400", children: Object.values(district.negativeFactors)
                                                        .reduce((a, b) => a + b, 0)
                                                        .toFixed(1) }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Toplam Risk" })] })] })] }), _jsx(TabsContent, { value: "scores", className: "space-y-3 mt-4", children: Object.entries(district.scores)
                                .filter(([key]) => key !== "overall")
                                .map(([key, value]) => {
                                const Icon = scoreIcons[key];
                                const color = getScoreColor(value);
                                return (_jsxs("div", { className: "bg-muted/30 rounded-lg p-3 flex items-center gap-3", children: [Icon && (_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${color}20` }, children: _jsx(Icon, { className: "w-5 h-5", style: { color } }) })), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm font-medium", children: scoreLabels[key] }), _jsx("span", { className: "text-sm font-bold", style: { color }, children: value.toFixed(1) })] }), _jsx(Progress, { value: value * 10, className: "h-2", style: {
                                                        ["--progress-background"]: color,
                                                    } })] })] }, key));
                            }) }), _jsxs(TabsContent, { value: "negative", className: "space-y-3 mt-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-amber-400 mb-4", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Risk fakt\u00F6rleri y\u00FCksek de\u011Ferler olumsuz durumu g\u00F6sterir (0-10 \u00F6l\u00E7e\u011Fi)" })] }), negativeData.map(({ factor, value, key }) => {
                                    const severity = value >= 5 ? "destructive" : value >= 3 ? "amber" : "emerald";
                                    const severityColor = severity === "destructive"
                                        ? "hsl(var(--destructive))"
                                        : severity === "amber"
                                            ? "#f59e0b"
                                            : "#10b981";
                                    return (_jsxs("div", { className: "bg-muted/30 rounded-lg p-3 flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${severityColor}20` }, children: _jsx(AlertTriangle, { className: "w-5 h-5", style: { color: severityColor } }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm font-medium", children: factor }), _jsx("span", { className: "text-sm font-bold", style: { color: severityColor }, children: value.toFixed(1) })] }), _jsx(Progress, { value: value * 10, className: "h-2", style: {
                                                            ["--progress-background"]: severityColor,
                                                        } })] })] }, key));
                                })] }), _jsxs(TabsContent, { value: "actions", className: "space-y-3 mt-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-primary mb-4", children: [_jsx(Target, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "\u00D6nerilen aksiyonlar ve potansiyel etkileri" })] }), district.recommendedActions.map((action, index) => (_jsxs("div", { className: "bg-muted/30 rounded-lg p-4 space-y-2", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: "text-sm font-medium", children: action.action }), _jsx(Badge, { variant: "outline", className: priorityColors[action.priority], children: priorityLabels[action.priority] })] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(TrendingUp, { className: "w-3 h-3 text-emerald-400" }), "Potansiyel: +", action.potentialScore.toFixed(1), " puan"] }), _jsx("span", { className: "font-semibold text-primary", children: action.budget })] })] }, index)))] })] })] }) }));
};
