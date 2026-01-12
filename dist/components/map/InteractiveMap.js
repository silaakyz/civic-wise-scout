import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import IzmirMap from "./IzmirMap.js";
import { MapPin } from "lucide-react";
import { RadarAnalysis } from "../dashboard/RadarAnalysis.js";
import { RecommendationsPanel } from "../dashboard/RecommendationsPanel.js";
export const InteractiveMap = ({ districts }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "glass-card p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: _jsx(MapPin, { className: "w-5 h-5 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold", children: "\u0130zmir B\u00F6lge Haritas\u0131" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "\u0130l\u00E7eye t\u0131kla \u2192 \u00F6nerilen aksiyonlar gelsin" })] })] }), _jsx(IzmirMap, { districts: districts, onSelectDistrict: setSelectedDistrict })] }), selectedDistrict && (_jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [_jsx(RadarAnalysis, { district: selectedDistrict }), _jsx(RecommendationsPanel, { districts: [selectedDistrict] })] }))] }));
};
