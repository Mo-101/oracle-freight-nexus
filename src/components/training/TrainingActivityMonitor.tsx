
import React from "react";
import { Timer, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TrainingActivity {
  id: string;
  stage: string;
  progress: number;
  timestamp: string;
  status: "completed" | "active" | "pending" | "error";
  metrics: {
    loss: number;
    accuracy: number;
    learningRate: number;
  };
}

interface TrainingActivityMonitorProps {
  isTraining: boolean;
  trainingActivities: TrainingActivity[];
}

export const TrainingActivityMonitor = ({ isTraining, trainingActivities }: TrainingActivityMonitorProps) => {
  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Training Pipeline Activity
          {isTraining && <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainingActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex-shrink-0">
                {activity.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {activity.status === 'active' && <div className="w-5 h-5 border-2 border-deepcal-light border-t-transparent rounded-full animate-spin" />}
                {activity.status === 'pending' && <Clock className="w-5 h-5 text-slate-400" />}
                {activity.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-medium">{activity.stage}</span>
                  <span className="text-xs text-slate-400">{activity.timestamp}</span>
                </div>
                <Progress value={activity.progress} className="h-2 mb-2" />
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Loss: </span>
                    <span className="text-deepcal-light">{activity.metrics.loss.toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Accuracy: </span>
                    <span className="text-green-400">{activity.metrics.accuracy.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">LR: </span>
                    <span className="text-slate-300">{activity.metrics.learningRate.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
