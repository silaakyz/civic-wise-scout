import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const districts = [
  { name: "Konak", lat: 38.4189, lng: 27.1287, score: 72 },
  { name: "Karşıyaka", lat: 38.4550, lng: 27.1120, score: 80 },
  { name: "Bornova", lat: 38.4622, lng: 27.2210, score: 65 },
  { name: "Buca", lat: 38.3853, lng: 27.1746, score: 55 },
  { name: "Balçova", lat: 38.3944, lng: 27.0500, score: 78 },
];

const getColor = (score: number) => {
  if (score >= 80) return "#2e7d32"; // yeşil
  if (score >= 65) return "#fbc02d"; // sarı
  return "#d32f2f"; // kırmızı
};

export default function IzmirMap() {
  return (
    <MapContainer
      center={[38.4192, 27.1287]}
      zoom={11}
      minZoom={11}
      maxZoom={14}
      style={{ height: "500px", width: "100%" }}
      maxBounds={[
        [38.2, 26.8],
        [38.6, 27.4],
      ]}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {districts.map((d) => (
        <CircleMarker
          key={d.name}
          center={[d.lat, d.lng]}
          radius={15}
          pathOptions={{
            color: getColor(d.score),
            fillColor: getColor(d.score),
            fillOpacity: 0.6,
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div>
              <strong>{d.name}</strong>
              <br />
              Skor: {d.score}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
