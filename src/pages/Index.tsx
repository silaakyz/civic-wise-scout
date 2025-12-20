import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DistrictScoreCard } from "@/components/dashboard/DistrictScoreCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";
import { ScenarioAnalysis } from "@/components/scenarios/ScenarioAnalysis";
import { ResourceAllocation } from "@/components/allocation/ResourceAllocation";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { districtData } from "@/data/districtData";
import heroBg from "@/assets/hero-bg.jpg";
import {
  MapPin,
  TrendingUp,
  Target,
  Users,
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate summary stats
  const avgScore =
    districtData.reduce((sum, d) => sum + d.scores.overall, 0) /
    districtData.length;
  const highPerformers = districtData.filter((d) => d.scores.overall >= 8.0).length;
  const needsAttention = districtData.filter((d) => d.scores.overall < 5.0).length;
  const totalActions = districtData.reduce(
    (sum, d) => sum + d.recommendedActions.length,
    0
  );

  const sortedDistricts = [...districtData].sort(
    (a, b) => a.scores.overall - b.scores.overall
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-8 animate-fade-up">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                LuxCivic{" "}
                <span className="gradient-text">Karar Destek Sistemi</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kentsel karar vericilerin farklı senaryolar altında en uygun kaynak
                dağıtımı ve hizmet önceliklendirmesi kararlarını alabilmesi için
                geliştirilen çok kriterli analiz platformu.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Ortalama Skor"
                value={avgScore.toFixed(1)}
                subtitle="10 üzerinden"
                icon={Target}
                trend={{ value: 3.2, isPositive: true }}
              />
              <StatsCard
                title="Bölge Sayısı"
                value={districtData.length}
                subtitle="İzmir ilçeleri"
                icon={MapPin}
                delay={100}
              />
              <StatsCard
                title="Yüksek Performans"
                value={highPerformers}
                subtitle="8+ skor"
                icon={TrendingUp}
                trend={{ value: 12, isPositive: true }}
                delay={200}
              />
              <StatsCard
                title="Aksiyon Önerisi"
                value={totalActions}
                subtitle="öncelikli eylem"
                icon={Users}
                delay={300}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Performance Chart - 2 cols */}
              <div className="lg:col-span-2">
                <PerformanceChart />
              </div>

              {/* Recommendations - 1 col */}
              <div className="lg:col-span-1">
                <RecommendationsPanel districts={districtData} />
              </div>
            </div>

            {/* District Score Cards */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  Bölge Skorları
                </h2>
                <p className="text-sm text-muted-foreground">
                  Düşükten yükseğe sıralı
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {sortedDistricts.map((district, index) => (
                  <DistrictScoreCard
                    key={district.id}
                    district={district}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "map":
        return <InteractiveMap districts={districtData} />;

      case "scenarios":
        return <ScenarioAnalysis districts={districtData} />;

      case "allocation":
        return <ResourceAllocation districts={districtData} />;

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

      <div className="min-h-screen flex flex-col bg-background relative">
        {/* Subtle background pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-5 -z-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />

        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 container mx-auto px-4 py-8">
          {renderContent()}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
