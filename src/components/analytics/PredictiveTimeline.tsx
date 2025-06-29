
import React from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineData {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
  events: string[];
}

const timelineData: TimelineData[] = [
  { date: "2025-01-01", predicted: 5.2, actual: 5.1, confidence: 95, events: ["Border clearance"] },
  { date: "2025-01-02", predicted: 5.4, confidence: 92, events: ["Weather delay possible"] },
  { date: "2025-01-03", predicted: 5.8, confidence: 88, events: ["Peak traffic period"] },
  { date: "2025-01-04", predicted: 5.3, confidence: 94, events: ["Normal conditions"] },
  { date: "2025-01-05", predicted: 5.1, confidence: 96, events: ["Optimal route"] },
];

export const PredictiveTimeline = () => {
  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center text-deepcal-light">
          <span className="mr-2">🔮</span>
          Predictive Transit Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,34,206,0.2)" />
            <XAxis dataKey="date" stroke="#e2e8f0" />
            <YAxis stroke="#e2e8f0" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #7e22ce",
                borderRadius: "8px",
              }}
              formatter={(value, name) => [`${value} days`, name === "predicted" ? "Predicted" : "Actual"]}
            />
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="#a855f7"
              fill="rgba(168, 85, 247, 0.1)"
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {timelineData.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-slate-300">{item.date}</span>
              <div className="flex items-center space-x-2">
                <span className="text-deepcal-light">{item.predicted}d</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400">{item.confidence}%</span>
                <span className="text-xs text-slate-400">{item.events[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
