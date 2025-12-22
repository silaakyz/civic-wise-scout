import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScenarioAnalysis } from "@/components/scenarios/ScenarioAnalysis";
import { ResourceAllocation } from "@/components/allocation/ResourceAllocation";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { LiveAnalytics } from "@/components/analytics/LiveAnalytics";
import { useDistricts } from "@/hooks/useDistricts";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardKPICards } from "@/components/dashboard/DashboardKPICards";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [scoreRange, setScoreRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState("score-desc");

  // Veritabanından verileri çek
  const { districts: dbDistricts, loading, error } = useDistricts();
  
  // Use districts from DB only (mock fallback removed)
  const allDistricts = dbDistricts;

  // Filter districts based on criteria
  const filteredDistricts = useMemo(() => {
    let result = [...allDistricts];

    // Filter by score range
    result = result.filter(
      (d) => d.scores.overall >= scoreRange[0] && d.scores.overall <= scoreRange[1]
    );

    // Sort
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

  // Calculate summary stats
  const stats = useMemo(() => {
    const avgScore =
      filteredDistricts.reduce((sum, d) => sum + d.scores.overall, 0) /
      (filteredDistricts.length || 1);
    const highPerformers = filteredDistricts.filter((d) => d.scores.overall >= 8.0).length;
    const mediumPerformers = filteredDistricts.filter(
      (d) => d.scores.overall >= 5.0 && d.scores.overall < 8.0
    ).length;
    const lowPerformers = filteredDistricts.filter((d) => d.scores.overall < 5.0).length;
    const totalActions = filteredDistricts.reduce(
      (sum, d) => sum + d.recommendedActions.length,
      0
    );
    const maxScore = Math.max(...filteredDistricts.map((d) => d.scores.overall), 0);
    const minScore = Math.min(...filteredDistricts.map((d) => d.scores.overall), 10);

    return {
      avgScore,
      highPerformers,
      mediumPerformers,
      lowPerformers,
      totalActions,
      maxScore,
      minScore,
      totalDistricts: filteredDistricts.length,
    };
  }, [filteredDistricts]);

  const handleReset = () => {
    setSelectedCategory("all");
    setScoreRange([0, 10]);
    setSortBy("score-desc");
  };

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Hata durumu (sadece veritabanı verisi yoksa göster)
  if (error && dbDistricts.length === 0) {
    console.warn('Database error, using mock data:', error);
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Dashboard Header */}
            <DashboardHeader onReset={handleReset} />

            {/* KPI Cards */}
            <DashboardKPICards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
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

              {/* Charts Area */}
              <div className="lg:col-span-3">
                <DashboardCharts
                  districts={filteredDistricts}
                  allDistricts={allDistricts}
                />
              </div>
            </div>

            {/* Bottom Table */}
            <DashboardTable districts={filteredDistricts} />
          </div>
        );

      case "analytics":
        return <LiveAnalytics districts={allDistricts} />;

      case "map":
        return <InteractiveMap districts={allDistricts} />;

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
        <meta
          name="description"
          content="LuxCivic, kentsel karar vericilerin farklı senaryolar altında en uygun kaynak dağıtımı ve hizmet önceliklendirmesi kararlarını alabilmesi için geliştirilen çok kriterli analiz ve senaryo tabanlı bir Karar Destek Sistemidir."
        />
        <meta
          name="keywords"
          content="kentsel planlama, karar destek sistemi, belediye, kaynak dağıtımı, hizmet önceliklendirmesi, çok kriterli analiz"
        />
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
