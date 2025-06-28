
import React from "react";
import { Brain, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ModelConfig {
  primaryLLM: string;
  creativity: number;
  responseLength: number;
  contextWindow: number;
  realTimeProcessing: boolean;
}

interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}

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

interface EngineConfigTabProps {
  modelConfig: ModelConfig;
  setModelConfig: (config: ModelConfig) => void;
  trainingMetrics: TrainingMetrics;
  isTraining: boolean;
  trainingActivities: TrainingActivity[];
}

export const EngineConfigTab = ({ 
  modelConfig, 
  setModelConfig, 
  trainingMetrics, 
  isTraining, 
  trainingActivities 
}: EngineConfigTabProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Engine Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Primary LLM</Label>
            <select className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white">
              <option>GPT-4 Turbo</option>
              <option>Claude-3 Opus</option>
              <option>Gemini Pro</option>
            </select>
          </div>
          <div>
            <Label className="text-slate-300">Creativity Level: {modelConfig.creativity}%</Label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={modelConfig.creativity}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-300">Response Length: {modelConfig.responseLength}%</Label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={modelConfig.responseLength}
              className="w-full mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Training Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 text-sm">Samples Processed</div>
              <div className="text-2xl font-bold text-green-400">{trainingMetrics.samplesProcessed.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Accuracy</div>
              <div className="text-2xl font-bold text-deepcal-light">{trainingMetrics.accuracy}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Last Training</div>
              <div className="text-slate-200">{trainingMetrics.lastTraining}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Model Version</div>
              <div className="text-slate-200">{trainingMetrics.modelVersion}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
