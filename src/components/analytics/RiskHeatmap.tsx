
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskData {
  region: string;
  risk: number;
  factors: string[];
  coordinates: [number, number];
}

const riskData: RiskData[] = [
  { region: "Border Crossing", risk: 85, factors: ["Customs delays", "Documentation"], coordinates: [2, 3] },
  { region: "Urban Transit", risk: 45, factors: ["Traffic", "Security"], coordinates: [1, 2] },
  { region: "Highway Corridor", risk: 25, factors: ["Weather", "Road conditions"], coordinates: [3, 1] },
  { region: "Port Area", risk: 60, factors: ["Congestion", "Strikes"], coordinates: [0, 4] },
];

export const RiskHeatmap = () => {
  const [selectedRegion, setSelectedRegion] = useState<RiskData | null>(null);

  const getRiskColor = (risk: number) => {
    if (risk > 70) return "bg-red-500";
    if (risk > 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center text-deepcal-light">
          <span className="mr-2">🗺️</span>
          Risk Assessment Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 bg-slate-800 rounded-lg overflow-hidden border border-deepcal-purple/30">
          {/* Grid background */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1 p-2">
            {Array.from({ length: 25 }).map((_, index) => (
              <div key={index} className="bg-slate-700/30 rounded border border-slate-600/20"></div>
            ))}
          </div>

          {/* Risk regions */}
          {riskData.map((region, index) => (
            <div
              key={index}
              className={`absolute w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${getRiskColor(region.risk)} opacity-80 glowing-border`}
              style={{
                left: `${region.coordinates[0] * 20 + 10}%`,
                top: `${region.coordinates[1] * 20 + 10}%`,
              }}
              onClick={() => setSelectedRegion(region)}
            >
              <div className="w-full h-full rounded-full animate-ping bg-current opacity-30"></div>
            </div>
          ))}
        </div>

        {selectedRegion && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-deepcal-purple/30">
            <h4 className="font-semibold text-deepcal-light">{selectedRegion.region}</h4>
            <div className="flex items-center mt-2">
              <span className="text-sm">Risk Level: </span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                  selectedRegion.risk > 70 ? "bg-red-500" : selectedRegion.risk > 40 ? "bg-yellow-500" : "bg-green-500"
                }`}
              >
                {selectedRegion.risk}%
              </span>
            </div>
            <div className="mt-2">
              <span className="text-sm text-slate-300">Risk Factors:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedRegion.factors.map((factor, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-xs">
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
