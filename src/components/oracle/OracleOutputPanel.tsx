
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Scroll, Brain, Hash, Download } from 'lucide-react';
import { NeutrosophicEngine, ForwarderData, WeightVector, TOPSISResult } from '@/utils/neutrosophicEngine';
import { VoiceNarration } from './VoiceNarration';

interface OracleOutputPanelProps {
  isVisible: boolean;
  weights: WeightVector;
  emergency?: string;
  cargoType?: string;
  origin?: string;
  destination?: string;
}

export const OracleOutputPanel = ({ 
  isVisible, 
  weights, 
  emergency = "cholera outbreak in Kanyama District",
  cargoType = "Emergency Medical Supplies",
  origin = "Johannesburg",
  destination = "Lusaka"
}: OracleOutputPanelProps) => {
  const [results, setResults] = useState<TOPSISResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [ceremonialSeal, setCeremonialSeal] = useState('');

  // Sample forwarder data - in real app this would come from API
  const sampleForwarders: ForwarderData[] = [
    { name: "Kuehne + Nagel", costPerKg: 4.61, transitDays: 5.2, reliability: 92, riskLevel: 8 },
    { name: "DHL Express", costPerKg: 5.21, transitDays: 6.0, reliability: 88, riskLevel: 15 },
    { name: "Siginon Logistics", costPerKg: 4.45, transitDays: 6.5, reliability: 85, riskLevel: 22 },
    { name: "Imperial Logistics", costPerKg: 4.78, transitDays: 5.8, reliability: 90, riskLevel: 12 },
    { name: "Bollore Africa", costPerKg: 4.93, transitDays: 7.2, reliability: 83, riskLevel: 28 }
  ];

  useEffect(() => {
    if (isVisible) {
      performOracleCalculation();
    }
  }, [isVisible, weights]);

  const performOracleCalculation = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const engine = new NeutrosophicEngine();
    const calculatedResults = engine.calculateTOPSIS(sampleForwarders, weights);
    
    setResults(calculatedResults);
    generateCeremonialSeal(calculatedResults[0]);
    setIsCalculating(false);
  };

  const generateCeremonialSeal = (topResult: TOPSISResult) => {
    const timestamp = new Date().toISOString();
    const seal = `DEEP++ SEAL\n✦ VERDICT ✦\n${topResult.forwarder}\nqseal:${topResult.sha256Hash}\n${timestamp}`;
    setCeremonialSeal(seal);
  };

  const getRankColor = (rank: number) => {
    const colors = ['text-deepcal-light', 'text-amber-400', 'text-rose-400'];
    return colors[rank - 1] || 'text-slate-400';
  };

  const getMedalIcon = (rank: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[rank - 1] || '🔹';
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      emergency,
      route: `${origin} → ${destination}`,
      cargoType,
      weights,
      results,
      ceremonialSeal,
      oracleVerdict: `${results[0]?.forwarder} chosen by algorithmic destiny`
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepcal-oracle-transmission-${Date.now()}.json`;
    a.click();
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Oracle Header */}
      <Card className="oracle-card overflow-hidden">
        <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-6 symbolic-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Scroll className="text-2xl text-white mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">🕊️ DEEPCAL++ ORACLE TRANSMISSION</h2>
                <p className="text-purple-100">vΩ NEUTROSOPHIC DECISION ENGINE</p>
              </div>
            </div>
            <div className="text-right">
              <div className="px-4 py-2 bg-black/20 rounded-full text-sm border border-purple-400/30">
                <span className="text-yellow-400">⚡ ACTIVE TRANSMISSION</span>
              </div>
              <button
                onClick={exportResults}
                className="mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm flex items-center"
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-deepcal-light mb-2">🚨 Emergency Context</h3>
              <p className="text-sm text-slate-300">{emergency}. ICU stocks at 23%. WHO pre-clearance granted.</p>
            </div>
            <div>
              <h3 className="font-semibold text-deepcal-light mb-2">📍 Corridor Intelligence</h3>
              <div className="text-sm text-slate-300 space-y-1">
                <div>Route: <span className="font-mono text-deepcal-light">{origin} → {destination}</span></div>
                <div>Distance: <span className="font-mono">2,100 km</span></div>
                <div>Border Risk: <span className="text-amber-400">⚠️ Medium</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Progress */}
      {isCalculating && (
        <Card className="oracle-card">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Brain className="w-6 h-6 text-deepcal-light animate-pulse" />
              <span className="text-lg">Oracle calculating destiny matrix...</span>
            </div>
            <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-deepcal-purple to-deepcal-light h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Panel */}
      {results.length > 0 && !isCalculating && (
        <>
          {/* TOPSIS Ranking Matrix */}
          <Card className="oracle-card">
            <CardHeader>
              <CardTitle className="text-deepcal-light flex items-center">
                📊 Neutrosophic TOPSIS Decision Matrix
                <Hash className="w-4 h-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-deepcal-purple/30">
                    <tr>
                      <th className="px-4 py-3 text-left">Rank</th>
                      <th className="px-4 py-3 text-left">Forwarder</th>
                      <th className="px-4 py-3 text-left">TOPSIS Score</th>
                      <th className="px-4 py-3 text-left">Truth (T)</th>
                      <th className="px-4 py-3 text-left">Indeterminacy (I)</th>
                      <th className="px-4 py-3 text-left">Falsity (F)</th>
                      <th className="px-4 py-3 text-left">Crisp Score</th>
                      <th className="px-4 py-3 text-left">Hash Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.forwarder} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                        <td className={`px-4 py-3 font-bold ${getRankColor(result.rank)}`}>
                          {getMedalIcon(result.rank)} {result.rank}
                        </td>
                        <td className="px-4 py-3 font-medium">{result.forwarder}</td>
                        <td className={`px-4 py-3 font-bold ${getRankColor(result.rank)}`}>
                          {result.normalizedScore.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-green-400">
                          {(result.neutrosophic.truth * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-yellow-400">
                          {(result.neutrosophic.indeterminacy * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-red-400">
                          {(result.neutrosophic.falsity * 100).toFixed(1)}%
                        </td>
                        <td className={`px-4 py-3 font-bold ${getRankColor(result.rank)}`}>
                          {result.neutrosophic.crispScore.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {result.sha256Hash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Voice Narration */}
          <VoiceNarration 
            results={results}
            emergency={emergency}
            cargoType={cargoType}
            origin={origin}
            destination={destination}
          />

          {/* Ceremonial Seal */}
          <Card className="oracle-card">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-deepcal-light mb-4">🔱 Ceremonial Decision Seal</h3>
              <div className="decision-seal mx-auto mb-4">
                <div className="text-center text-white font-bold text-xs leading-tight whitespace-pre-line">
                  {ceremonialSeal}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                <div>Oracle Proverb: <em>"In the monsoon of uncertainty, the owl chooses the branch with both roots and reach."</em></div>
                <div className="mt-2 text-purple-300">"{results[0]?.forwarder} blessed with cargo destiny"</div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
