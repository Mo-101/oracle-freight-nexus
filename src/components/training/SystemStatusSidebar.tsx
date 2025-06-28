
import React from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface SystemStatus {
  neutroEngine: string;
  firestore: string;
  groqAPI: string;
  trainingPipeline: string;
}

interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}

interface SystemStatusSidebarProps {
  systemStatus: SystemStatus;
  trainingMetrics: TrainingMetrics;
}

export const SystemStatusSidebar = ({ systemStatus, trainingMetrics }: SystemStatusSidebarProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light text-lg">System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(systemStatus).map(([system, status]) => (
          <div key={system} className="flex items-center justify-between">
            <span className="text-slate-300 text-sm capitalize">{system.replace(/([A-Z])/g, ' $1')}</span>
            {getStatusIcon(status)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
