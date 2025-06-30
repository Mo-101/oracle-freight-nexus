import React from "react";
import { Sliders } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
  experience: number;
}

interface WeightsConfigTabProps {
  weights: WeightVector;
  setWeights: (weights: WeightVector) => void;
}

export const WeightsConfigTab = ({ weights, setWeights }: WeightsConfigTabProps) => {
  const handleWeightChange = (criterion: keyof WeightVector, value: number) => {
    const newWeights = { ...weights, [criterion]: value / 100 };
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    
    if (total > 0) {
      Object.keys(newWeights).forEach(key => {
        newWeights[key as keyof WeightVector] = newWeights[key as keyof WeightVector] / total;
      });
    }
    
    setWeights(newWeights);
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Criteria Weights Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(weights).map(([criterion, weight]) => (
          <div key={criterion}>
            <div className="flex justify-between mb-2">
              <Label className="text-slate-300 capitalize">{criterion}</Label>
              <span className="text-deepcal-light font-mono">{(weight * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weight * 100}
              onChange={(e) => handleWeightChange(criterion as keyof WeightVector, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
