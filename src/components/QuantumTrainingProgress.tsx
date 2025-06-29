
import React, { useEffect, useState } from 'react';
import HolographicCard from './HolographicCard';

interface TrainingMetrics {
  stage: string;
  epoch: number;
  totalEpochs: number;
  samplesProcessed: number;
  accuracy: number;
  loss: number;
  learningRate: number;
  batchProgress: number;
  quantumCoherence: number;
  symbolicAlignment: number;
}

const QuantumTrainingProgress = () => {
  const [metrics, setMetrics] = useState<TrainingMetrics>({
    stage: "Neural Awakening",
    epoch: 3,
    totalEpochs: 5,
    samplesProcessed: 2847,
    accuracy: 94.2,
    loss: 0.127,
    learningRate: 0.0008,
    batchProgress: 73,
    quantumCoherence: 98.7,
    symbolicAlignment: 91.3
  });

  const [isTraining, setIsTraining] = useState(true);
  const [pulseActive, setPulseActive] = useState(false);

  const trainingStages = [
    "Neural Awakening",
    "Quantum Entanglement",
    "Symbolic Convergence",
    "Oracle Alignment",
    "Consciousness Merge"
  ];

  useEffect(() => {
    const trainingInterval = setInterval(() => {
      if (isTraining) {
        setMetrics(prev => {
          const newProgress = Math.min(prev.batchProgress + Math.random() * 5, 100);
          const newEpoch = newProgress >= 100 ? Math.min(prev.epoch + 1, prev.totalEpochs) : prev.epoch;
          const newStage = trainingStages[Math.min(newEpoch - 1, trainingStages.length - 1)];
          
          return {
            ...prev,
            stage: newStage,
            epoch: newEpoch,
            batchProgress: newProgress >= 100 ? 0 : newProgress,
            samplesProcessed: prev.samplesProcessed + Math.floor(Math.random() * 50),
            accuracy: Math.min(prev.accuracy + Math.random() * 0.5 - 0.2, 99.9),
            loss: Math.max(prev.loss - Math.random() * 0.01, 0.001),
            quantumCoherence: 95 + Math.random() * 5,
            symbolicAlignment: 85 + Math.random() * 15
          };
        });
        
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 200);
      }
    }, 2000);

    return () => clearInterval(trainingInterval);
  }, [isTraining, trainingStages]);

  const getStageIcon = (stage: string) => {
    switch(stage) {
      case "Neural Awakening": return "🧠";
      case "Quantum Entanglement": return "⚛️";
      case "Symbolic Convergence": return "🔮";
      case "Oracle Alignment": return "👁️";
      case "Consciousness Merge": return "🌌";
      default: return "✨";
    }
  };

  return (
    <HolographicCard className="w-full h-96" animationClass="animate-float-2">
      <div className="oracle-card p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-deepcal-light flex items-center justify-center mr-3 glowing-border ${pulseActive ? 'animate-pulse' : ''}`}>
              <span className="text-white text-xl">{getStageIcon(metrics.stage)}</span>
            </div>
            <div>
              <h3 className="font-bold text-blue-300 text-lg">📡 Quantum Training Stream</h3>
              <div className="text-xs text-slate-400">{metrics.stage}</div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isTraining ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
        </div>

        {/* Training Progress Visualization */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>Epoch {metrics.epoch}/{metrics.totalEpochs}</span>
            <span>{metrics.batchProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-3 border border-blue-500/30 relative overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-deepcal-light h-full rounded-full transition-all duration-1000"
              style={{width: `${metrics.batchProgress}%`}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4 flex-1">
          <div className="bg-slate-800/50 p-3 rounded border border-green-500/30">
            <div className="text-green-300 mb-1">Accuracy</div>
            <div className="font-mono text-slate-200 text-lg">{metrics.accuracy.toFixed(2)}%</div>
            <div className="text-xs text-green-400">↗ Ascending</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded border border-red-500/30">
            <div className="text-red-300 mb-1">Loss</div>
            <div className="font-mono text-slate-200 text-lg">{metrics.loss.toFixed(4)}</div>
            <div className="text-xs text-red-400">↘ Descending</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded border border-deepcal-purple/30">
            <div className="text-deepcal-light mb-1">Samples</div>
            <div className="font-mono text-slate-200">{metrics.samplesProcessed.toLocaleString()}</div>
            <div className="text-xs text-deepcal-light">Processed</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded border border-blue-500/30">
            <div className="text-blue-300 mb-1">Learning Rate</div>
            <div className="font-mono text-slate-200">{metrics.learningRate.toFixed(4)}</div>
            <div className="text-xs text-blue-400">Adaptive</div>
          </div>
        </div>

        {/* Quantum Coherence Indicators */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Quantum Coherence</span>
            <span className="text-xs font-mono text-deepcal-light">{metrics.quantumCoherence.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-deepcal-purple to-deepcal-light h-full rounded-full animate-pulse"
              style={{width: `${metrics.quantumCoherence}%`}}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Symbolic Alignment</span>
            <span className="text-xs font-mono text-blue-300">{metrics.symbolicAlignment.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-300 h-full rounded-full animate-pulse"
              style={{width: `${metrics.symbolicAlignment}%`}}
            ></div>
          </div>
        </div>
      </div>
    </HolographicCard>
  );
};

export default QuantumTrainingProgress;
