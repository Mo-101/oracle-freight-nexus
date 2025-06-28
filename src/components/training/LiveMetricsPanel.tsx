
import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LiveMetricsPanelProps {
  isTraining: boolean;
}

export const LiveMetricsPanel = ({ isTraining }: LiveMetricsPanelProps) => {
  const [metrics, setMetrics] = useState({
    cpu: 72,
    memory: 85,
    gpu: 91,
    throughput: 1247
  });

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        gpu: Math.max(50, Math.min(100, prev.gpu + (Math.random() - 0.5) * 8)),
        throughput: Math.max(800, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 100))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTraining]);

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">CPU Usage</span>
            <span className="text-deepcal-light">{metrics.cpu}%</span>
          </div>
          <Progress value={metrics.cpu} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Memory</span>
            <span className="text-deepcal-light">{metrics.memory}%</span>
          </div>
          <Progress value={metrics.memory} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">GPU Usage</span>
            <span className="text-deepcal-light">{metrics.gpu}%</span>
          </div>
          <Progress value={metrics.gpu} className="h-2" />
        </div>
        <div className="pt-2 border-t border-slate-700">
          <div className="text-xs text-slate-400">Throughput</div>
          <div className="text-lg font-bold text-green-400">{metrics.throughput} samples/sec</div>
        </div>
      </CardContent>
    </Card>
  );
};
