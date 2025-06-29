
import React from 'react';
import { SymbolicDecision } from '@/types/freight';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Brain, Target, Shield, Volume2 } from 'lucide-react';
import { unifiedTTS } from '@/services/unifiedTTS';

interface SymbolicDecisionEngineProps {
  decision: SymbolicDecision;
  onSpeakDecision?: () => void;
}

export const SymbolicDecisionEngine = ({ decision, onSpeakDecision }: SymbolicDecisionEngineProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const speakDecision = async () => {
    const narrative = `Oracle decision: ${decision.recommendation}. 
    Confidence level: ${Math.round(decision.confidence * 100)} percent. 
    Based on ${decision.dataPoints} canonical data points. 
    ${decision.reasoning.slice(0, 2).join('. ')}.`;
    
    try {
      await unifiedTTS.generateSpeech(narrative, {
        voice: 'af_sarah',
        emotion: 'authoritative and confident',
        useRandomSeed: true
      });
    } catch (error) {
      console.error('Voice synthesis failed:', error);
    }
    
    onSpeakDecision?.();
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center justify-between">
          <div className="flex items-center">
            🧠 Symbolic Decision Engine
            <Brain className="w-5 h-5 ml-2" />
          </div>
          <button
            onClick={speakDecision}
            className="p-2 bg-deepcal-purple hover:bg-deepcal-dark rounded-full transition-colors"
            title="Voice Decision Justification"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Recommendation */}
        <div className="text-center p-6 bg-gradient-to-r from-deepcal-dark to-deepcal-purple rounded-xl">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-deepcal-light mr-2" />
            <h3 className="text-xl font-bold text-white">Oracle Recommendation</h3>
          </div>
          <p className="text-2xl font-bold text-deepcal-light mb-2">
            {decision.recommendation}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className={`text-lg font-semibold ${getConfidenceColor(decision.confidence)}`}>
              {Math.round(decision.confidence * 100)}% Confidence
            </div>
            <div className="text-slate-300">
              • {decision.dataPoints} Data Points
            </div>
            <div className="text-green-400">
              Ethics: {Math.round(decision.ethicsScore * 100)}%
            </div>
          </div>
        </div>

        {/* Reasoning Chain */}
        <div>
          <h4 className="font-semibold text-deepcal-light mb-3 flex items-center">
            🔗 Symbolic Reasoning Chain
          </h4>
          <div className="space-y-2">
            {decision.reasoning.map((reason, index) => (
              <div 
                key={index}
                className="flex items-start p-3 bg-slate-800/30 rounded border-l-4 border-deepcal-purple"
              >
                <span className="bg-deepcal-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-slate-200">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Uncertainty Factors */}
        {decision.uncertaintyFactors.length > 0 && (
          <div>
            <h4 className="font-semibold text-amber-400 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Uncertainty Factors Accounted
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {decision.uncertaintyFactors.map((factor, index) => (
                <div 
                  key={index}
                  className="p-2 bg-amber-900/20 text-amber-200 rounded border border-amber-700/30 text-sm"
                >
                  {factor}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Visualization */}
        <div>
          <h4 className="font-semibold text-deepcal-light mb-3">Decision Confidence Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Data Quality</span>
              <span>{Math.round(decision.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-deepcal-purple h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${decision.confidence * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Ethical Alignment</span>
              <span>{Math.round(decision.ethicsScore * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${decision.ethicsScore * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
