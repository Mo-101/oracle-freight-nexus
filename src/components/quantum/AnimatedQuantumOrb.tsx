
import React, { useState, useEffect } from 'react';
import { canonicalShipmentData } from '@/data/canonicalData';
import { syntheticDataGenerator } from '@/services/syntheticDataGenerator';

interface KnowledgeMetrics {
  canonicalData: number;
  syntheticData: number;
  totalKnowledge: number;
  growthRate: number;
  trainingProgress: number;
}

export const AnimatedQuantumOrb = () => {
  const [knowledge, setKnowledge] = useState<KnowledgeMetrics>({
    canonicalData: 0,
    syntheticData: 0,  
    totalKnowledge: 0,
    growthRate: 0,
    trainingProgress: 0
  });

  const [isGrowing, setIsGrowing] = useState(false);

  useEffect(() => {
    // Simulate knowledge growth animation
    const interval = setInterval(() => {
      setKnowledge(prev => {
        const canonicalCount = canonicalShipmentData.length;
        const syntheticCount = 5000; // Base synthetic data count
        const totalKnowledge = canonicalCount + syntheticCount;
        const growthRate = Math.min(95, prev.growthRate + 0.5);
        const trainingProgress = Math.min(100, prev.trainingProgress + 0.3);

        return {
          canonicalData: Math.min(canonicalCount, prev.canonicalData + 2),
          syntheticData: Math.min(syntheticCount, prev.syntheticData + 50),
          totalKnowledge: Math.min(totalKnowledge, prev.totalKnowledge + 52),
          growthRate,
          trainingProgress
        };
      });
    }, 100);

    // Trigger growth animation periodically
    const growthInterval = setInterval(() => {
      setIsGrowing(true);
      setTimeout(() => setIsGrowing(false), 2000);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(growthInterval);
    };
  }, []);

  const fillPercentage = (knowledge.totalKnowledge / 5105) * 100;
  const orbRadius = 140;
  const strokeWidth = 8;
  const normalizedRadius = orbRadius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${fillPercentage / 100 * circumference} ${circumference}`;

  return (
    <div className="flex justify-center mb-16">
      <div className="relative w-96 h-96 rounded-full oracle-card flex items-center justify-center">
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-deepcal-light' : 
                i % 3 === 1 ? 'bg-deepcal-purple' : 'bg-blue-400'
              } animate-bounce opacity-60`}
              style={{
                top: `${20 + (i * 7)}%`,
                left: `${15 + (i * 6)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            />
          ))}
        </div>

        {/* Main Orb SVG with Animated Fill */}
        <div className="absolute inset-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            {/* Background Circle */}
            <circle
              cx="140"
              cy="140"
              r={normalizedRadius}
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Animated Fill Circle */}
            <circle
              cx="140"
              cy="140"
              r={normalizedRadius}
              stroke="url(#knowledgeGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${isGrowing ? 'animate-pulse' : ''}`}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))'
              }}
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="knowledgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Pulsing Inner Rings */}
            <circle
              cx="140"
              cy="140"
              r="60"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <circle
              cx="140"
              cy="140"
              r="40"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
        </div>

        {/* Center Content */}
        <div className="text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-deepcal-purple to-deepcal-light flex items-center justify-center mx-auto mb-4 glowing-border">
            <i className="fas fa-infinity text-white text-3xl"></i>
          </div>
          
          <h3 className="font-bold text-2xl text-deepcal-light mb-2">Quantum Decision Orb</h3>
          <div className="text-xs text-slate-400 mb-4">Grey-Quantum AHP-TOPSIS</div>
          
          {/* Knowledge Metrics */}
          <div className="mb-4 space-y-1">
            <div className="text-sm font-mono text-deepcal-light">
              Knowledge: {knowledge.totalKnowledge.toLocaleString()}/5,105
            </div>
            <div className="text-xs text-slate-300">
              Growth: {fillPercentage.toFixed(1)}% • Training: {knowledge.trainingProgress.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">
              Canonical: {knowledge.canonicalData} • Synthetic: {knowledge.syntheticData.toLocaleString()}
            </div>
          </div>
          
          <div className="text-xs text-slate-300 mb-4">
            <div className="font-mono text-deepcal-light">
              "Collapsing wavefunctions for optimal decisions"
            </div>
          </div>
          
          {/* Ranking Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { rank: '#1', id: 'Q4', score: '0.892', color: 'green' },
              { rank: '#2', id: 'Q3', score: '0.845', color: 'blue' },
              { rank: '#3', id: 'Q1', score: '0.712', color: 'yellow' },
              { rank: '#4', id: 'Q2', score: '0.301', color: 'red' }
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-${item.color}-900/30 p-1 rounded border border-${item.color}-500/20 transform transition-all duration-500 ${
                  isGrowing ? 'scale-110' : 'scale-100'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`text-${item.color}-300`}>{item.rank}</div>
                <div className="font-bold text-white">{item.id}</div>
                <div className={`text-xs text-${item.color}-400`}>{item.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orbiting Quantum Particles */}
        <div className="absolute inset-0">
          <div className="absolute w-3 h-3 rounded-full bg-deepcal-light animate-spin" 
               style={{
                 top: '20%',
                 left: '50%',
                 transformOrigin: '0 120px',
                 animationDuration: '4s'
               }}>
          </div>
          <div className="absolute w-2 h-2 rounded-full bg-deepcal-purple animate-spin" 
               style={{
                 top: '50%',
                 right: '20%',
                 transformOrigin: '-120px 0',
                 animationDuration: '6s',
                 animationDirection: 'reverse'
               }}>
          </div>
          <div className="absolute w-2 h-2 rounded-full bg-blue-400 animate-spin" 
               style={{
                 bottom: '25%',
                 left: '25%',
                 transformOrigin: '80px -80px',
                 animationDuration: '5s'
               }}>
          </div>
        </div>

        {/* Knowledge Growth Pulse Effect */}
        {isGrowing && (
          <div className="absolute inset-0 rounded-full border-4 border-deepcal-light animate-ping opacity-20"></div>
        )}
      </div>
    </div>
  );
};
