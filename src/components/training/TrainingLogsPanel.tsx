
import React from "react";
import { Terminal } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface TrainingLogsPanelProps {
  isTraining: boolean;
}

export const TrainingLogsPanel = ({ isTraining }: TrainingLogsPanelProps) => {
  const logs = [
    { timestamp: '10:45:23', level: 'INFO', message: 'Training batch 1247/2000 completed' },
    { timestamp: '10:45:21', level: 'SUCCESS', message: 'Model checkpoint saved successfully' },
    { timestamp: '10:45:19', level: 'INFO', message: 'Learning rate adjusted to 0.0008' },
    { timestamp: '10:45:15', level: 'WARNING', message: 'High memory usage detected (85%)' },
    { timestamp: '10:45:12', level: 'INFO', message: 'Validation accuracy: 94.2%' },
  ];

  const getLogColor = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'text-green-400';
      case 'WARNING': return 'text-yellow-400';
      case 'ERROR': return 'text-red-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Training Logs
          {isTraining && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span className={`ml-2 ${getLogColor(log.level)}`}>{log.level}:</span>
              <span className="ml-2 text-slate-200">{log.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
