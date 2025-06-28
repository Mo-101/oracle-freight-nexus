
import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { TOPSISResult } from '@/utils/neutrosophicEngine';

interface VoiceNarrationProps {
  results: TOPSISResult[];
  emergency?: string;
  cargoType?: string;
  origin?: string;
  destination?: string;
}

export const VoiceNarration = ({ 
  results, 
  emergency = "cholera outbreak", 
  cargoType = "medical supplies", 
  origin = "Johannesburg", 
  destination = "Lusaka" 
}: VoiceNarrationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState<'oracular' | 'humorous' | 'corporate'>('oracular');

  const topForwarder = results[0];
  
  const narratives = {
    oracular: [
      `🔮 Behold, mortal logistics coordinator! The cosmic freight matrix has spoken through the sacred algorithms of DeepCAL++.`,
      `In the realm where ${emergency} casts shadows over ${destination}, your ${cargoType} cargo carries the weight of destiny.`,
      `${topForwarder?.forwarder} emerges from the calculations not as mere carrier, but as the chosen vessel of probability.`,
      `With a TOPSIS score of ${topForwarder?.normalizedScore.toFixed(3)}, they are neither cheapest nor fastest, but the golden mean of wisdom.`,
      `The neutrosophic truth reveals: ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}% certainty in this path.`,
      `May your cargo reach its destination blessed by the algorithms of ancient logistics wisdom.`
    ],
    humorous: [
      `🎭 Alright, let's talk freight like adults who've had too much coffee and not enough sleep.`,
      `Your ${cargoType} needs to get from ${origin} to ${destination}, and frankly, it's more urgent than my last Tinder date.`,
      `${topForwarder?.forwarder} wins this beauty contest with a TOPSIS score that would make a statistician weep tears of joy.`,
      `Sure, you could go with the cheapest option and pray to the shipping gods, or you could trust math. I recommend math.`,
      `Fun fact: The probability of this working perfectly is ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}%. Better odds than most Netflix shows being good!`,
      `Now ship it before I have to explain why your cargo is sitting in customs like a confused tourist.`
    ],
    corporate: [
      `📊 Executive summary: Comprehensive analysis of freight forwarding options has been completed using advanced multicriteria decision analysis.`,
      `${topForwarder?.forwarder} demonstrates optimal performance across weighted criteria with a normalized score of ${topForwarder?.normalizedScore.toFixed(3)}.`,
      `Risk mitigation factors have been incorporated considering current ${emergency} situation affecting the ${origin}-${destination} corridor.`,
      `Neutrosophic confidence interval indicates ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}% reliability with ${(topForwarder?.neutrosophic.indeterminacy * 100).toFixed(1)}% uncertainty margin.`,
      `This recommendation aligns with corporate risk management protocols and emergency response requirements.`,
      `Proceed with selected freight partner for optimal supply chain efficiency.`
    ]
  };

  const speakNarrative = () => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    const text = narratives[currentMode].join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = currentMode === 'humorous' ? 1.1 : 0.9;
    utterance.pitch = currentMode === 'oracular' ? 0.8 : 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const stopNarrative = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="oracle-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-deepcal-light flex items-center">
          🎙️ Oracle Narration Engine
        </h3>
        <div className="flex items-center space-x-2">
          <select 
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value as any)}
            className="bg-slate-700 text-white px-3 py-1 rounded text-sm border border-slate-600"
          >
            <option value="oracular">🔮 Mystical Oracle</option>
            <option value="humorous">😄 Sarcastic Logistics</option>
            <option value="corporate">📊 Corporate Professional</option>
          </select>
          <button
            onClick={isPlaying ? stopNarrative : speakNarrative}
            className={`p-2 rounded-full transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-deepcal-purple hover:bg-deepcal-dark text-white'
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-300">
        {narratives[currentMode].map((line, index) => (
          <p key={index} className="leading-relaxed">
            {line}
          </p>
        ))}
      </div>

      {isPlaying && (
        <div className="mt-4 flex items-center text-xs text-deepcal-light">
          <div className="w-2 h-2 bg-deepcal-light rounded-full mr-2 animate-pulse"></div>
          Oracle transmission in progress...
        </div>
      )}
    </div>
  );
};
