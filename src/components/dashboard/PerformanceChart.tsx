import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { quarter: "1. Çeyrek", infrastructure: 7.2, environment: 6.8, social: 7.5, transportation: 7.0, security: 6.9, education: 7.3, health: 6.7 },
  { quarter: "2. Çeyrek", infrastructure: 7.4, environment: 7.0, social: 7.7, transportation: 7.2, security: 7.1, education: 7.5, health: 6.9 },
  { quarter: "3. Çeyrek", infrastructure: 7.6, environment: 7.2, social: 7.9, transportation: 7.4, security: 7.3, education: 7.7, health: 7.1 },
  { quarter: "4. Çeyrek", infrastructure: 7.8, environment: 7.4, social: 8.1, transportation: 7.6, security: 7.5, education: 7.9, health: 7.3 },
];

const lines = [
  { key: "infrastructure", name: "Altyapı", color: "#006064" },
  { key: "environment", name: "Çevre", color: "#2e7d32" },
  { key: "social", name: "Sosyal", color: "#ff9800" },
  { key: "transportation", name: "Ulaşım", color: "#1976d2" },
  { key: "security", name: "Güvenlik", color: "#7b1fa2" },
  { key: "education", name: "Eğitim", color: "#c2185b" },
  { key: "health", name: "Sağlık", color: "#d32f2f" },
];

export const PerformanceChart = () => {
  return (
    <div className="glass-card p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
      <h3 className="text-lg font-bold text-foreground mb-4">
        Performans Trendi
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="quarter" 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              domain={[6, 9]} 
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
