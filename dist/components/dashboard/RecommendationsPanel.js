import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils.js";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "../ui/badge.js";
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
export const RecommendationsPanel = ({ districts }) => {
    // Tüm ilçelerin tüm aksiyonlarını alıyoruz
    const allActions = districts.flatMap((d) => d.recommendedActions.map((action) => ({
        ...action,
        districtName: d.name,
        districtScore: d.scores.overall,
    })));
    // İsteğe göre öncelik ve potansiyel puana göre sırala
    const priorityActions = allActions
        .sort((a, b) => b.potentialScore - a.potentialScore)
        .slice(0, 10); // İlk 10 aksiyonu göster, istersen sayıyı değiştir
    return (_jsxs("div", { className: "glass-card p-6 animate-fade-up", style: { animationDelay: "300ms" }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-bold text-foreground", children: "\u00D6ncelikli Aksiyonlar" }), _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [priorityActions.length, " Aksiyon"] })] }), _jsx("div", { className: "space-y-4", children: priorityActions.map((action, index) => {
                    const config = priorityConfig[action.priority] || priorityConfig.low;
                    const Icon = config.icon;
                    return (_jsx("div", { className: "p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-colors", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: cn("p-2 rounded-lg", config.className), children: _jsx(Icon, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: action.districtName }), _jsx(Badge, { variant: "outline", className: "text-xs shrink-0", children: action.budget })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: action.action }), _jsxs("div", { className: "flex items-center gap-3 text-xs", children: [_jsxs("span", { className: "text-score-excellent font-medium", children: ["+", action.potentialScore.toFixed(1), " puan"] }), _jsxs("span", { className: "text-muted-foreground", children: ["Mevcut: ", action.districtScore.toFixed(1)] })] })] })] }) }, `${action.districtName}-${index}`));
                }) })] }));
};
