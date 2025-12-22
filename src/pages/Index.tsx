import IzmirMap from "@/components/map/IzmirMap";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScenarioAnalysis } from "@/components/scenarios/ScenarioAnalysis";
import { ResourceAllocation } from "@/components/allocation/ResourceAllocation";
import { LiveAnalytics } from "@/components/analytics/LiveAnalytics";
import { districtData } from "@/data/districtData";
import { useDistricts } from "@/hooks/useDistricts";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardKPICards } from "@/components/dashboard/DashboardKPICards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10]);
  const [sortBy, setSortBy] = useState("score-desc");

  // DB → fallback mock
  const { districts: dbDistricts, loading, error } = useDistricts();
  const allDistricts = dbDistricts.length > 0 ? dbDistricts : districtData;

  // Filter + sort
  const filteredDistricts = useMemo(() => {
    let result = [...allDistricts];

    result = result.filter(
      (d) => d.scores.overall >= scoreRange[0] && d.scores.overall <= scoreRange[1]
    );

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
    const avgScore =
      filteredDistricts.reduce((sum, d) => sum + d.scores.overall, 0) /
      (filteredDistricts.length || 1);

    return {
      avgScore,
      highPerformers: filteredDistricts.filter((d) => d.scores.overall >= 8).length,
      mediumPerformers: filteredDistricts.filter(
        (d) => d.scores.overall >= 5 && d.scores.overall < 8
      ).length,
      lowPerformers: filteredDistricts.filter((d) => d.scores.overall < 5).length,
      totalActions: filteredDistricts.reduce(
        (sum, d) => sum + d.recommendedActions.length,
        0
      ),
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Veriler yükleniyor...</p>
      </div>
    );
  }

  if (error && dbDistricts.length === 0) {
    console.warn("DB yok, mock data kullanılıyor:", error);
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardHeader onReset={handleReset} />
            <DashboardKPICards stats={stats} />

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <DashboardFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  scoreRange={scoreRange}
                  setScoreRange={setScoreRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  stats={stats}
                />
              </div>

              <div className="lg:col-span-3">
                <DashboardCharts
                  districts={filteredDistricts}
                  allDistricts={allDistricts}
                />
              </div>
            </div>

            <DashboardTable districts={filteredDistricts} />
          </div>
        );

      case "analytics":
        return <LiveAnalytics districts={allDistricts} />;

      case "map":
        return (
          <div className="h-[600px] rounded-xl overflow-hidden border">
            <IzmirMap districts={allDistricts} />
          </div>
        );

      case "scenarios":
        return <ScenarioAnalysis districts={allDistricts} />;

      case "allocation":
        return <ResourceAllocation districts={allDistricts} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>LuxCivic - Kentsel Karar Destek Sistemi</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 container mx-auto px-4 py-6">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
