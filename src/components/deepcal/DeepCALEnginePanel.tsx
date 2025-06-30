
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Calculator, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { deepcalCore } from '@/utils/deepcalCore';
import { DeepCALDecision } from '@/utils/deepcalCore';

export const DeepCALEnginePanel = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [decision, setDecision] = useState<DeepCALDecision | null>(null);
  const [error, setError] = useState<string>('');
  const [auditTrail, setAuditTrail] = useState<string>('');

  const runDeepCALAnalysis = useCallback(async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      console.log('🚀 Starting DeepCAL Core Analysis...');
      const result = await deepcalCore.makeDecision();
      setDecision(result);
      
      // Generate audit trail
      const trail = deepcalCore.generateAuditTrail(result);
      setAuditTrail(trail);
      
      console.log('✅ DeepCAL Analysis Complete');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ DeepCAL Analysis Failed:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            DeepCAL Decision Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={runDeepCALAnalysis}
              disabled={isProcessing}
              className="bg-deepcal-purple hover:bg-deepcal-dark"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Run AHP-TOPSIS Analysis
                </>
              )}
            </Button>
            
            {decision && (
              <div className="text-sm text-slate-400">
                Last analysis: {decision.timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-400/30 rounded flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
              <span className="text-red-100">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Panel */}
      {decision && (
        <>
          {/* Criteria Weights */}
          <Card className="oracle-card">
            <CardHeader>
              <CardTitle className="text-deepcal-light flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Neutrosophic AHP Criteria Weights
                {decision.isConsistent ? (
                  <span className="ml-2 text-green-400 text-sm">✅ Consistent</span>
                ) : (
                  <span className="ml-2 text-red-400 text-sm">❌ Inconsistent</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {formatPercentage(decision.criteriaWeights.cost)}
                  </div>
                  <div className="text-sm text-slate-400">Cost Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {formatPercentage(decision.criteriaWeights.time)}
                  </div>
                  <div className="text-sm text-slate-400">Time Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatPercentage(decision.criteriaWeights.reliability)}
                  </div>
                  <div className="text-sm text-slate-400">Reliability Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">
                    {formatPercentage(decision.criteriaWeights.risk)}
                  </div>
                  <div className="text-sm text-slate-400">Risk Weight</div>
                </div>
              </div>
              
              <div className="text-sm text-slate-400">
                Consistency Ratio: {decision.consistencyRatio.toFixed(4)} 
                {decision.consistencyRatio < 0.1 ? ' (Acceptable)' : ' (Needs Review)'}
              </div>
            </CardContent>
          </Card>

          {/* TOPSIS Rankings */}
          <Card className="oracle-card">
            <CardHeader>
              <CardTitle className="text-deepcal-light">🏆 TOPSIS Forwarder Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-deepcal-purple/30">
                    <tr>
                      <th className="px-4 py-3 text-left">Rank</th>
                      <th className="px-4 py-3 text-left">Forwarder</th>
                      <th className="px-4 py-3 text-left">Closeness Score</th>
                      <th className="px-4 py-3 text-left">Distance to Ideal</th>
                      <th className="px-4 py-3 text-left">Distance to Anti-Ideal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decision.ranking.map((result) => {
                      const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
                      const medalIcons = ['🥇', '🥈', '🥉'];
                      const colorClass = rankColors[result.rank - 1] || 'text-slate-400';
                      const medal = medalIcons[result.rank - 1] || '🔹';

                      return (
                        <tr key={result.alternative.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                          <td className={`px-4 py-3 font-bold ${colorClass}`}>
                            {medal} {result.rank}
                          </td>
                          <td className="px-4 py-3 font-medium">{result.alternative.name}</td>
                          <td className={`px-4 py-3 font-bold ${colorClass}`}>
                            {(result.closenessCoefficient * 100).toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {result.distanceToIdeal.toFixed(4)}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {result.distanceToAntiIdeal.toFixed(4)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail */}
          {auditTrail && (
            <Card className="oracle-card">
              <CardHeader>
                <CardTitle className="text-deepcal-light flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Scientific Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-slate-900/50 p-4 rounded whitespace-pre-wrap text-slate-300 overflow-x-auto">
                  {auditTrail}
                </pre>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
