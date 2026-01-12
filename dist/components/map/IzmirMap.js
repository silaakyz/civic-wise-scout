import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useEffect, useRef } from "react";
const getColor = (score) => {
    if (score >= 8.5)
        return "#2e7d32";
    if (score >= 7)
        return "#fbc02d";
    return "#d32f2f";
};
// 🔒 İzmir sınırları
const IZMIR_BOUNDS = [
    [37.9, 26.4], // Güney-Batı
    [39.3, 28.5], // Kuzey-Doğu
];
export default function IzmirMap({ districts, onSelectDistrict, }) {
    const mapRef = useRef(null);
    useEffect(() => {
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
    }, []);
    return (_jsx("div", { className: "glass-card p-4 h-[520px]", children: _jsxs(MapContainer, { bounds: IZMIR_BOUNDS, maxBounds: IZMIR_BOUNDS, maxBoundsViscosity: 1.0, zoom: 10, minZoom: 9, maxZoom: 12, style: { height: "100%", width: "100%" }, whenReady: (e) => (mapRef.current = e.target), children: [_jsx(TileLayer, { attribution: "\u00A9 OpenStreetMap", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), districts.map((d) => (_jsx(CircleMarker, { center: d.coordinates, radius: Math.max(8, d.radius / 120), pathOptions: {
                        color: getColor(d.scores.overall),
                        fillColor: getColor(d.scores.overall),
                        fillOpacity: 0.7,
                    }, eventHandlers: {
                        click: () => onSelectDistrict(d), // 🔥 EN KRİTİK SATIR
                    }, children: _jsxs(Tooltip, { children: [_jsx("strong", { children: d.name }), _jsx("br", {}), "Skor: ", d.scores.overall.toFixed(1)] }) }, d.id)))] }) }));
}
