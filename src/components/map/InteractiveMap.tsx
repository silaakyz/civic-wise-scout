import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { District, getScoreColor } from "@/data/districtData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadarAnalysis } from "@/components/dashboard/RadarAnalysis";
import { MapPin, Key, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InteractiveMapProps {
  districts: District[];
}

export const InteractiveMap = ({ districts }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [tokenInput, setTokenInput] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [27.1287, 38.4192], // İzmir coordinates
        zoom: 10,
        pitch: 30,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        "top-right"
      );

      map.current.on("load", () => {
        setMapLoaded(true);
      });

      // Add district markers
      map.current.on("style.load", () => {
        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        districts.forEach((district) => {
          const color = getScoreColor(district.scores.overall);
          const size = Math.max(30, district.radius / 20);

          // Create custom marker element
          const el = document.createElement("div");
          el.className = "district-marker";
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.backgroundColor = color;
          el.style.borderRadius = "50%";
          el.style.border = "3px solid white";
          el.style.boxShadow = `0 0 15px ${color}, 0 2px 10px rgba(0,0,0,0.3)`;
          el.style.cursor = "pointer";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.transition = "transform 0.2s, box-shadow 0.2s";
          el.innerHTML = `<span style="color: white; font-size: 11px; font-weight: bold;">${district.scores.overall.toFixed(1)}</span>`;

          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.2)";
            el.style.boxShadow = `0 0 25px ${color}, 0 4px 15px rgba(0,0,0,0.4)`;
          });

          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
            el.style.boxShadow = `0 0 15px ${color}, 0 2px 10px rgba(0,0,0,0.3)`;
          });

          el.addEventListener("click", () => {
            setSelectedDistrict(district);
            map.current?.flyTo({
              center: [district.coordinates[1], district.coordinates[0]],
              zoom: 12,
              duration: 1000,
            });
          });

          const marker = new mapboxgl.Marker(el)
            .setLngLat([district.coordinates[1], district.coordinates[0]])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 8px;">
                  <h4 style="font-weight: bold; margin-bottom: 4px;">${district.name}</h4>
                  <p style="color: #666; font-size: 12px;">Skor: <strong style="color: ${color}">${district.scores.overall.toFixed(1)}</strong>/10</p>
                </div>
              `)
            )
            .addTo(map.current!);

          markersRef.current.push(marker);
        });
      });

      // Cleanup
      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        map.current?.remove();
      };
    } catch (error) {
      console.error("Mapbox initialization error:", error);
    }
  }, [mapboxToken, districts]);

  // Token input screen
  if (!mapboxToken) {
    return (
      <div className="space-y-6 animate-fade-up">
        <Card className="glass-card max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              Mapbox API Anahtarı Gerekli
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              İzmir haritasını görüntülemek için Mapbox public token'ınızı girin. 
              Token'ınızı{" "}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                mapbox.com <ExternalLink className="w-3 h-3" />
              </a>{" "}
              adresinden ücretsiz alabilirsiniz.
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveToken} disabled={!tokenInput.trim()}>
                Kaydet
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Token tarayıcınızda yerel olarak saklanacaktır.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("mapbox_token");
              setMapboxToken("");
            }}
          >
            Token Değiştir
          </Button>
        </div>

        <div
          ref={mapContainer}
          className="relative w-full h-[500px] rounded-2xl overflow-hidden border-2 border-primary/20"
        />

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <p className="text-sm font-semibold text-foreground">Skor Ölçeği:</p>
          <div className="flex items-center gap-3">
            {[
              { color: "hsl(0, 72%, 51%)", label: "1-4" },
              { color: "hsl(30, 100%, 50%)", label: "4-5.5" },
              { color: "hsl(45, 100%, 50%)", label: "5.5-7" },
              { color: "hsl(84, 60%, 45%)", label: "7-8.5" },
              { color: "hsl(142, 71%, 35%)", label: "8.5+" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
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
