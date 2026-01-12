import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.js";
import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../ui/table.js";
import { TableIcon, Search, ChevronLeft, ChevronRight, ExternalLink, } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { DistrictDetailDialog } from "./DistrictDetailDialog.js";
const getScoreClass = (score) => {
    if (score >= 8)
        return "bg-emerald-500/10 text-emerald-500";
    if (score >= 6)
        return "bg-green-500/10 text-green-500";
    if (score >= 5)
        return "bg-amber-500/10 text-amber-500";
    if (score >= 3)
        return "bg-orange-500/10 text-orange-500";
    return "bg-red-500/10 text-red-500";
};
const ITEMS_PER_PAGE = 10;
export const DashboardTable = ({ districts }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const filteredDistricts = districts.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedDistricts = filteredDistricts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return (_jsxs(Card, { className: "bg-card/50 backdrop-blur-sm border-border/50", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [_jsx(TableIcon, { className: "w-4 h-4 text-primary" }), "B\u00F6lge Detaylar\u0131", _jsxs(Badge, { variant: "secondary", className: "ml-2", children: [filteredDistricts.length, " b\u00F6lge"] })] }), _jsxs("div", { className: "relative w-full sm:w-64", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "B\u00F6lge ara...", value: searchTerm, onChange: (e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }, className: "pl-9 bg-background/50" })] })] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "rounded-lg border border-border/50 overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [_jsx(TableHead, { className: "text-xs font-semibold", children: "S\u0131ra" }), _jsx(TableHead, { className: "text-xs font-semibold", children: "B\u00F6lge" }), _jsx(TableHead, { className: "text-xs font-semibold text-center", children: "Genel" }), _jsx(TableHead, { className: "text-xs font-semibold text-center hidden md:table-cell", children: "Altyap\u0131" }), _jsx(TableHead, { className: "text-xs font-semibold text-center hidden md:table-cell", children: "\u00C7evre" }), _jsx(TableHead, { className: "text-xs font-semibold text-center hidden lg:table-cell", children: "Sosyal" }), _jsx(TableHead, { className: "text-xs font-semibold text-center hidden lg:table-cell", children: "Ula\u015F\u0131m" }), _jsx(TableHead, { className: "text-xs font-semibold text-center hidden xl:table-cell", children: "G\u00FCvenlik" }), _jsx(TableHead, { className: "text-xs font-semibold text-center", children: "Aksiyon" }), _jsx(TableHead, { className: "text-xs font-semibold w-10" })] }) }), _jsx(TableBody, { children: paginatedDistricts.map((district, index) => (_jsxs(TableRow, { className: "hover:bg-muted/20 transition-colors", children: [_jsxs(TableCell, { className: "text-xs font-medium text-muted-foreground", children: ["#", startIndex + index + 1] }), _jsx(TableCell, { className: "text-xs font-medium", children: district.name }), _jsx(TableCell, { className: "text-center", children: _jsx(Badge, { className: cn("text-xs", getScoreClass(district.scores.overall)), children: district.scores.overall.toFixed(1) }) }), _jsx(TableCell, { className: "text-center hidden md:table-cell", children: _jsx("span", { className: "text-xs text-muted-foreground", children: district.scores.infrastructure.toFixed(1) }) }), _jsx(TableCell, { className: "text-center hidden md:table-cell", children: _jsx("span", { className: "text-xs text-muted-foreground", children: district.scores.environment.toFixed(1) }) }), _jsx(TableCell, { className: "text-center hidden lg:table-cell", children: _jsx("span", { className: "text-xs text-muted-foreground", children: district.scores.social.toFixed(1) }) }), _jsx(TableCell, { className: "text-center hidden lg:table-cell", children: _jsx("span", { className: "text-xs text-muted-foreground", children: district.scores.transportation.toFixed(1) }) }), _jsx(TableCell, { className: "text-center hidden xl:table-cell", children: _jsx("span", { className: "text-xs text-muted-foreground", children: district.scores.security.toFixed(1) }) }), _jsx(TableCell, { className: "text-center", children: _jsx(Badge, { variant: "outline", className: "text-xs", children: district.recommendedActions.length }) }), _jsx(TableCell, { children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => {
                                                        setSelectedDistrict(district);
                                                        setDetailOpen(true);
                                                    }, children: _jsx(ExternalLink, { className: "w-3 h-3" }) }) })] }, district.id))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("p", { className: "text-xs text-muted-foreground", children: [startIndex + 1, "-", Math.min(startIndex + ITEMS_PER_PAGE, filteredDistricts.length), " ", "/ ", filteredDistricts.length, " b\u00F6lge"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "outline", size: "icon", className: "h-7 w-7", onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1)
                                        .map((page, index, arr) => (_jsxs("span", { children: [index > 0 && arr[index - 1] !== page - 1 && (_jsx("span", { className: "text-muted-foreground px-1", children: "..." })), _jsx(Button, { variant: currentPage === page ? "default" : "outline", size: "icon", className: "h-7 w-7", onClick: () => setCurrentPage(page), children: page })] }, page))), _jsx(Button, { variant: "outline", size: "icon", className: "h-7 w-7", onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] }))] }), _jsx(DistrictDetailDialog, { district: selectedDistrict, open: detailOpen, onOpenChange: setDetailOpen })] }));
};
