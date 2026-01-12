import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getScoreClass, getScoreColor } from "../../lib/district.js";
import { cn } from "../../lib/utils.js";
import { Building2, Leaf, Users, Bus, Shield, GraduationCap, Heart, TrendingUp } from "lucide-react";
import { Progress } from "../ui/progress.js";
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
export const DistrictScoreCard = ({ district, rank, onClick }) => {
    const scoreClass = getScoreClass(district.scores.overall);
    const scoreColor = getScoreColor(district.scores.overall);
    return (_jsxs("div", { onClick: onClick, className: cn("glass-card p-5 hover-lift cursor-pointer animate-fade-up", scoreClass), style: { animationDelay: `${rank * 50}ms` }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold text-foreground", style: { color: scoreColor }, children: district.name }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["S\u0131ralama: ", rank] })] }), _jsx("div", { className: "text-3xl font-bold", style: { color: scoreColor }, children: district.scores.overall.toFixed(1) })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsx("span", { children: "Genel Skor" }), _jsxs("span", { children: [(district.scores.overall * 10).toFixed(0), "%"] })] }), _jsx(Progress, { value: district.scores.overall * 10, className: "h-2", style: {
                            ['--progress-background']: scoreColor
                        } })] }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(district.scores)
                    .filter(([key]) => key !== "overall")
                    .slice(0, 6)
                    .map(([key, value]) => {
                    const Icon = scoreIcons[key];
                    return (_jsxs("div", { className: "flex items-center gap-2 text-xs", style: { color: scoreColor }, children: [Icon && _jsx(Icon, { className: "w-3.5 h-3.5" }), _jsxs("span", { className: "truncate", children: [scoreLabels[key], ": ", value.toFixed(1)] })] }, key));
                }) }), _jsxs("div", { className: "flex items-center gap-2 mt-4 pt-3 border-t border-border/50", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-score-excellent" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["Trend: ", district.trendData[0].toFixed(1), " \u2192 ", district.trendData[3].toFixed(1)] })] })] }));
};
