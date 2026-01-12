import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Filter, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.js";
import { Slider } from "../ui/slider.js";
import { Badge } from "../ui/badge.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "../ui/collapsible.js";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, } from "recharts";
export const DashboardFilters = ({ selectedCategory, setSelectedCategory, scoreRange, setScoreRange, sortBy, setSortBy, stats, }) => {
    const [isOpen, setIsOpen] = useState(true);
    const categories = [
        { value: "all", label: "Tüm Kategoriler" },
        { value: "infrastructure", label: "Altyapı" },
        { value: "environment", label: "Çevre" },
        { value: "social", label: "Sosyal" },
        { value: "transportation", label: "Ulaşım" },
        { value: "security", label: "Güvenlik" },
        { value: "education", label: "Eğitim" },
        { value: "health", label: "Sağlık" },
    ];
    const sortOptions = [
        { value: "score-desc", label: "Skor (Yüksek → Düşük)" },
        { value: "score-asc", label: "Skor (Düşük → Yüksek)" },
        { value: "name-asc", label: "İsim (A → Z)" },
        { value: "name-desc", label: "İsim (Z → A)" },
    ];
    const distributionData = [
        { name: "Yüksek", value: stats.highPerformers, color: "#10b981" },
        { name: "Orta", value: stats.mediumPerformers, color: "#f59e0b" },
        { name: "Düşük", value: stats.lowPerformers, color: "#ef4444" },
    ];
    return (_jsx(Card, { className: "bg-card/50 backdrop-blur-sm border-border/50 sticky top-4", children: _jsxs(Collapsible, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CollapsibleTrigger, { className: "flex items-center justify-between w-full", children: [_jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [_jsx(Filter, { className: "w-4 h-4 text-primary" }), "Filtreler"] }), _jsx(ChevronDown, { className: `w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}` })] }) }), _jsx(CollapsibleContent, { children: _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Kategori" }), _jsxs(Select, { value: selectedCategory, onValueChange: setSelectedCategory, children: [_jsx(SelectTrigger, { className: "w-full bg-background/50", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { className: "bg-popover border border-border shadow-lg z-50", children: categories.map((cat) => (_jsx(SelectItem, { value: cat.value, children: cat.label }, cat.value))) })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Skor Aral\u0131\u011F\u0131" }), _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [scoreRange[0], " - ", scoreRange[1]] })] }), _jsx(Slider, { value: scoreRange, onValueChange: setScoreRange, min: 0, max: 10, step: 0.5, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground", children: [_jsx("span", { children: "0" }), _jsx("span", { children: "5" }), _jsx("span", { children: "10" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "S\u0131ralama" }), _jsxs(Select, { value: sortBy, onValueChange: setSortBy, children: [_jsx(SelectTrigger, { className: "w-full bg-background/50", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { className: "bg-popover border border-border shadow-lg z-50", children: sortOptions.map((opt) => (_jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value))) })] })] }), _jsxs("div", { className: "space-y-2 pt-2 border-t border-border/50", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Performans Da\u011F\u0131l\u0131m\u0131" }), _jsx("div", { className: "h-40", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: distributionData, cx: "50%", cy: "50%", innerRadius: 30, outerRadius: 50, paddingAngle: 3, dataKey: "value", children: distributionData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                            backgroundColor: "hsl(var(--card))",
                                                            border: "1px solid hsl(var(--border))",
                                                            borderRadius: "8px",
                                                        } }), _jsx(Legend, { iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: "10px" } })] }) }) })] })] }) })] }) }));
};
