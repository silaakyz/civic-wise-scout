import { useEffect, useRef, useState } from "react";
import { District, getScoreColor } from "@/data/districtData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadarAnalysis } from "@/components/dashboard/RadarAnalysis";
import { MapPin, ZoomIn, ZoomOut, Layers } from "lucide-react";

interface InteractiveMapProps {
  districts: District[];
}

export const InteractiveMap = ({ districts }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [zoom, setZoom] = useState(1);

  // Simple interactive map visualization (without Leaflet for simplicity)
  const mapCenter = { lat: 38.4192, lng: 27.1287 };

  const getPosition = (coords: [number, number]) => {
    const latRange = { min: 38.25, max: 38.55 };
    const lngRange = { min: 26.9, max: 27.35 };
    
    const x = ((coords[1] - lngRange.min) / (lngRange.max - lngRange.min)) * 100;
    const y = ((latRange.max - coords[0]) / (latRange.max - latRange.min)) * 100;
    
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                İzmir Bölge Haritası
              </h3>
              <p className="text-sm text-muted-foreground">
                Bölgeleri seçerek detaylı analiz görüntüleyin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="secondary">{Math.round(zoom * 100)}%</Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          ref={mapRef}
          className="relative w-full h-[500px] rounded-2xl overflow-hidden border-2 border-primary/20"
          style={{
            background: `
              linear-gradient(135deg, 
                hsl(var(--primary) / 0.05) 0%, 
                hsl(var(--accent) / 0.1) 50%,
                hsl(var(--primary) / 0.05) 100%
              )
            `,
          }}
        >
          {/* Map background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* District markers */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            {districts.map((district) => {
              const pos = getPosition(district.coordinates);
              const color = getScoreColor(district.scores.overall);
              const isSelected = selectedDistrict?.id === district.id;
              const size = Math.max(40, district.radius / 15);

              return (
                <button
                  key={district.id}
                  className={`
                    absolute transform -translate-x-1/2 -translate-y-1/2
                    rounded-full flex items-center justify-center
                    transition-all duration-300 cursor-pointer
                    hover:scale-110 hover:z-20
                    ${isSelected ? "ring-4 ring-primary ring-offset-2 z-30 scale-110" : ""}
                  `}
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    boxShadow: `0 0 ${isSelected ? 30 : 15}px ${color}`,
                    opacity: 0.85,
                  }}
                  onClick={() => setSelectedDistrict(district)}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: district.scores.overall > 6 ? "#fff" : "#fff" }}
                  >
                    {district.scores.overall.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass p-3 rounded-xl">
            <p className="text-xs font-semibold text-foreground mb-2">Skor Ölçeği</p>
            <div className="flex items-center gap-1">
              {[
                { color: "hsl(0, 72%, 51%)", label: "1-4" },
                { color: "hsl(30, 100%, 50%)", label: "4-5.5" },
                { color: "hsl(45, 100%, 50%)", label: "5.5-7" },
                { color: "hsl(84, 60%, 45%)", label: "7-8.5" },
                { color: "hsl(142, 71%, 35%)", label: "8.5+" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedDistrict && (
        <div className="grid lg:grid-cols-2 gap-6">
          <RadarAnalysis district={selectedDistrict} />
          
          <div className="glass-card p-6 animate-fade-up">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {selectedDistrict.name} - Önerilen Aksiyonlar
            </h3>
            <div className="space-y-3">
              {selectedDistrict.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border bg-background/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{action.action}</span>
                    <Badge
                      variant={
                        action.priority === "high"
                          ? "destructive"
                          : action.priority === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {action.priority === "high"
                        ? "Yüksek"
                        : action.priority === "medium"
                        ? "Orta"
                        : "Düşük"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Bütçe: {action.budget}</span>
                    <span className="text-score-excellent font-medium">
                      +{action.potentialScore.toFixed(1)} puan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
