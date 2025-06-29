
import React from 'react';
import { ForwarderIntelligence } from '@/types/freight';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface ForwarderIntelligenceMatrixProps {
  forwarders: ForwarderIntelligence[];
  cargoType: string;
}

export const ForwarderIntelligenceMatrix = ({ forwarders, cargoType }: ForwarderIntelligenceMatrixProps) => {
  const getEmergencyGradeColor = (grade: string) => {
    switch (grade) {
      case 'Critical': return 'bg-red-900/30 text-red-300';
      case 'Priority': return 'bg-yellow-900/30 text-yellow-300';
      default: return 'bg-blue-900/30 text-blue-300';
    }
  };

  const getReliabilityIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const sortedForwarders = [...forwarders].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center">
          🏢 Forwarder Intelligence Matrix
          <Trophy className="w-5 h-5 ml-2" />
        </CardTitle>
        <p className="text-sm text-slate-400">
          Analyzing {forwarders.length} forwarders for {cargoType} cargo type
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-deepcal-purple/30">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Forwarder</th>
                <th className="px-4 py-3 text-left">Reliability</th>
                <th className="px-4 py-3 text-left">Cost/kg</th>
                <th className="px-4 py-3 text-left">Avg Transit</th>
                <th className="px-4 py-3 text-left">Emergency Grade</th>
                <th className="px-4 py-3 text-left">Coverage</th>
                <th className="px-4 py-3 text-left">Specializations</th>
              </tr>
            </thead>
            <tbody>
              {sortedForwarders.map((forwarder, index) => (
                <tr key={forwarder.name} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-400 mr-2" />}
                      <span className={index < 3 ? 'font-bold text-deepcal-light' : 'text-slate-300'}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold text-white">{forwarder.name}</div>
                      <div className="text-xs text-slate-400">
                        {forwarder.totalShipments} total shipments
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getReliabilityIcon(forwarder.reliabilityScore)}
                      <span className="ml-2 font-semibold">
                        {forwarder.reliabilityScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-400">
                    ${forwarder.avgCostPerKg.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {forwarder.avgTransitDays.toFixed(1)} days
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getEmergencyGradeColor(forwarder.emergencyGrade)}`}>
                      {forwarder.emergencyGrade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-deepcal-purple h-2 rounded-full" 
                        style={{ width: `${forwarder.quoteCoverage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400">{forwarder.quoteCoverage}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {forwarder.specializations.slice(0, 2).map((spec, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                      {forwarder.specializations.length > 2 && (
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                          +{forwarder.specializations.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
