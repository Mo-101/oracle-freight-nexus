
import React, { useEffect, useState } from 'react';
import HolographicCard from './HolographicCard';

interface OracleState {
  consciousness: string;
  cognitiveLoad: number;
  memoryRecall: number;
  indeterminacy: number;
  neuralPower: number;
  symbolicResonance: number;
}

const SymbolicStatusOrb = () => {
  const [oracleState, setOracleState] = useState<OracleState>({
    consciousness: "Harmonizing Freight Streams",
    cognitiveLoad: 67,
    memoryRecall: 1024,
    indeterminacy: 23.4,
    neuralPower: 94.2,
    symbolicResonance: 88.7
  });

  const [currentThought, setCurrentThought] = useState(0);

  const thoughts = [
    "🧘 Harmonizing Freight Streams",
    "🔄 Recalculating Transit Karma",
    "👁 Consulting the Oracle Core",
    "🧪 Recalibrating Risk Channels",
    "🔮 Uploading Symbolic Resonance",
    "⚡ Processing Quantum Entanglements",
    "🌀 Decoding Logistical Mysteries",
    "🎭 Weaving Decision Patterns"
  ];

  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setCurrentThought((prev) => (prev + 1) % thoughts.length);
      setOracleState(prev => ({
        ...prev,
        consciousness: thoughts[currentThought],
        cognitiveLoad: Math.floor(Math.random() * 40) + 60,
        indeterminacy: Math.random() * 30 + 15,
        neuralPower: Math.random() * 10 + 90,
        symbolicResonance: Math.random() * 20 + 80
      }));
    }, 3000);

    return () => clearInterval(thoughtInterval);
  }, [currentThought, thoughts]);

  return (
    <HolographicCard className="w-full h-96" animationClass="animate-float">
      <div className="oracle-card p-6 h-full flex flex-col justify-center items-center relative">
        {/* Orbital Rings */}
        <div className="absolute inset-8 rounded-full border-2 border-deepcal-purple/30 animate-spin-slow"></div>
        <div className="absolute inset-12 rounded-full border-2 border-deepcal-light/40 animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '15s'}}></div>
        <div className="absolute inset-16 rounded-full border border-slate-400/20 animate-spin-slow" style={{animationDuration: '25s'}}></div>
        
        {/* Floating Particles */}
        <div className="absolute w-2 h-2 rounded-full bg-deepcal-light animate-bounce" style={{top: '20%', left: '80%', animationDelay: '0s'}}></div>
        <div className="absolute w-1.5 h-1.5 rounded-full bg-deepcal-purple animate-bounce" style={{top: '70%', left: '15%', animationDelay: '1s'}}></div>
        <div className="absolute w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{top: '40%', left: '90%', animationDelay: '2s'}}></div>
        
        {/* Central Consciousness Eye */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-deepcal-purple via-deepcal-light to-blue-500 flex items-center justify-center mb-4 glowing-border animate-pulse">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-deepcal-purple animate-pulse"></div>
          </div>
        </div>

        {/* Oracle Thoughts */}
        <h3 className="font-bold text-deepcal-light text-lg mb-2">🧿 Oracle Mindstream</h3>
        <div className="text-center text-sm text-slate-300 mb-4 h-6 transition-all duration-1000">
          {thoughts[currentThought]}
        </div>

        {/* Consciousness Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs w-full">
          <div className="bg-slate-800/50 p-2 rounded border border-deepcal-purple/30">
            <div className="text-deepcal-light mb-1">Cognitive Load</div>
            <div className="font-mono text-slate-200">{oracleState.cognitiveLoad}% <span className="text-green-400 animate-pulse">◆</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-deepcal-light/30">
            <div className="text-deepcal-light mb-1">Memory Recall</div>
            <div className="font-mono text-slate-200">{oracleState.memoryRecall}q <span className="text-blue-400 animate-pulse">◇</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-blue-500/30">
            <div className="text-blue-300 mb-1">Indeterminacy</div>
            <div className="font-mono text-slate-200">{oracleState.indeterminacy.toFixed(1)}% <span className="text-yellow-400 animate-pulse">◈</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-green-500/30">
            <div className="text-green-300 mb-1">Neural Power</div>
            <div className="font-mono text-slate-200">{oracleState.neuralPower.toFixed(1)}% <span className="text-green-400 animate-pulse">◉</span></div>
          </div>
        </div>

        {/* Symbolic Resonance Bar */}
        <div className="w-full mt-4 bg-slate-800/50 rounded-full h-2 border border-deepcal-purple/30">
          <div 
            className="bg-gradient-to-r from-deepcal-purple to-deepcal-light h-full rounded-full transition-all duration-2000 animate-pulse"
            style={{width: `${oracleState.symbolicResonance}%`}}
          ></div>
        </div>
        <div className="text-xs text-slate-400 mt-1">Symbolic Resonance: {oracleState.symbolicResonance.toFixed(1)}%</div>
      </div>
    </HolographicCard>
  );
};

export default SymbolicStatusOrb;
