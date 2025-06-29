
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Database, Network, Zap, Activity } from "lucide-react";

export const QuantumCards = () => {
  const quantumNodes = [
    {
      id: "neural-core",
      title: "Neural Core",
      icon: Brain,
      status: "active",
      progress: 94,
      metrics: {
        throughput: "2.4K ops/sec",
        accuracy: "94.2%",
        latency: "12ms",
      },
      color: "text-deepcal-light",
    },
    {
      id: "quantum-processor",
      title: "Quantum Processor",
      icon: Cpu,
      status: "training",
      progress: 67,
      metrics: {
        qubits: "128 active",
        coherence: "99.7%",
        gates: "1.2M/sec",
      },
      color: "text-blue-400",
    },
    {
      id: "data-mesh",
      title: "Data Mesh",
      icon: Database,
      status: "optimizing",
      progress: 89,
      metrics: {
        records: "80K+",
        sync: "Real-time",
        integrity: "99.9%",
      },
      color: "text-green-400",
    },
    {
      id: "neural-network",
      title: "Neural Network",
      icon: Network,
      status: "active",
      progress: 91,
      metrics: {
        layers: "12 deep",
        neurons: "2.4M",
        weights: "8.7M",
      },
      color: "text-cyan-400",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "training":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "optimizing":
        return "bg-deepcal-purple/20 text-deepcal-light border-deepcal-purple/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {quantumNodes.map((node) => {
        const IconComponent = node.icon;
        return (
          <Card
            key={node.id}
            className="oracle-card hover:glowing-border transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <IconComponent className={`mr-2 ${node.color}`} size={20} />
                  {node.title}
                </CardTitle>
                <Badge className={`text-xs ${getStatusColor(node.status)}`}>{node.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Performance</span>
                  <span className="font-semibold text-deepcal-light">{node.progress}%</span>
                </div>
                <Progress value={node.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                {Object.entries(node.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-400 capitalize">{key}:</span>
                    <span className="font-mono text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
