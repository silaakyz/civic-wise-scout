import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { InteractiveMap } from "../components/map/InteractiveMap.js";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "../components/layout/Header.js";
import { Footer } from "../components/layout/Footer.js";
import { ScenarioAnalysis } from "../components/scenarios/ScenarioAnalysis.js";
import { ResourceAllocation } from "../components/allocation/ResourceAllocation.js";
import { LiveAnalytics } from "../components/analytics/LiveAnalytics.js";
import { districtData } from "../data/districtData.js";
import { useDistricts } from "../hooks/useDistricts.js";
import { DashboardHeader } from "../components/dashboard/DashboardHeader.js";
import { DashboardKPICards } from "../components/dashboard/DashboardKPICards.js";
import { DashboardFilters } from "../components/dashboard/DashboardFilters.js";
import { DashboardCharts } from "../components/dashboard/DashboardCharts.js";
import { DashboardTable } from "../components/dashboard/DashboardTable.js";
const Index = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [scoreRange, setScoreRange] = useState([0, 10]);
    const [sortBy, setSortBy] = useState("score-desc");
    // DB → fallback mock
    const { districts: dbDistricts, loading, error } = useDistricts();
    const allDistricts = dbDistricts.length > 0 ? dbDistricts : districtData;
    // Filter + sort
    const filteredDistricts = useMemo(() => {
        let result = [...allDistricts];
        result = result.filter((d) => d.scores.overall >= scoreRange[0] && d.scores.overall <= scoreRange[1]);
        switch (sortBy) {
            case "score-desc":
                result.sort((a, b) => b.scores.overall - a.scores.overall);
                break;
            case "score-asc":
                result.sort((a, b) => a.scores.overall - b.scores.overall);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        return result;
    }, [allDistricts, scoreRange, sortBy]);
    // Stats
    const stats = useMemo(() => {
        const avgScore = filteredDistricts.reduce((sum, d) => sum + d.scores.overall, 0) /
            (filteredDistricts.length || 1);
        return {
            avgScore,
            highPerformers: filteredDistricts.filter((d) => d.scores.overall >= 8).length,
            mediumPerformers: filteredDistricts.filter((d) => d.scores.overall >= 5 && d.scores.overall < 8).length,
            lowPerformers: filteredDistricts.filter((d) => d.scores.overall < 5).length,
            totalActions: filteredDistricts.reduce((sum, d) => sum + d.recommendedActions.length, 0),
            maxScore: Math.max(...filteredDistricts.map((d) => d.scores.overall), 0),
            minScore: Math.min(...filteredDistricts.map((d) => d.scores.overall), 10),
            totalDistricts: filteredDistricts.length,
        };
    }, [filteredDistricts]);
    const handleReset = () => {
        setSelectedCategory("all");
        setScoreRange([0, 10]);
        setSortBy("score-desc");
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { className: "text-muted-foreground", children: "Veriler y\u00FCkleniyor..." }) }));
    }
    if (error && dbDistricts.length === 0) {
        console.warn("DB yok, mock data kullanılıyor:", error);
    }
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (_jsxs("div", { className: "space-y-6", children: [_jsx(DashboardHeader, { onReset: handleReset }), _jsx(DashboardKPICards, { stats: stats }), _jsxs("div", { className: "grid lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsx(DashboardFilters, { selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, scoreRange: scoreRange, setScoreRange: setScoreRange, sortBy: sortBy, setSortBy: setSortBy, stats: stats }) }), _jsx("div", { className: "lg:col-span-3", children: _jsx(DashboardCharts, { districts: filteredDistricts, allDistricts: allDistricts }) })] }), _jsx(DashboardTable, { districts: filteredDistricts })] }));
            case "analytics":
                return _jsx(LiveAnalytics, { districts: allDistricts });
            case "map":
                return (_jsx("div", { className: "space-y-6", children: _jsx(InteractiveMap, { districts: allDistricts }) }));
            case "scenarios":
                return _jsx(ScenarioAnalysis, { districts: allDistricts });
            case "allocation":
                return _jsx(ResourceAllocation, { districts: allDistricts });
            default:
                return null;
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Helmet, { children: _jsx("title", { children: "LuxCivic - Kentsel Karar Destek Sistemi" }) }), _jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [_jsx(Header, { activeTab: activeTab, onTabChange: setActiveTab }), _jsx("main", { className: "flex-1 container mx-auto px-4 py-6", children: renderContent() }), _jsx(Footer, {})] })] }));
};
export default Index;
