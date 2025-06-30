
import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react'; // This line is already correct, no change needed.
import { TOPSISResult } from '@/utils/neutrosophicEngine';
import { unifiedTTS } from '@/services/unifiedTTS';
import { deepseekClient } from '@/services/deepseekClient';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMode, setCurrentMode] = useState<'oracular' | 'humorous' | 'corporate'>('oracular');
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [generatedNarrative, setGeneratedNarrative] = useState<string>('');

  const topForwarder = results[0];
  
  const generateAINarrative = async () => {
    setIsGenerating(true);
    try {
      const context = `
        Analysis Results:
        - Top Forwarder: ${topForwarder?.forwarder}
        - TOPSIS Score: ${topForwarder?.normalizedScore.toFixed(3)}
        - Neutrosophic Truth: ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}%
        - Emergency: ${emergency}
        - Cargo: ${cargoType}
        - Route: ${origin} to ${destination}
      `;

      const prompt = `Generate a narrative analysis of these freight forwarding results. 
      Explain why ${topForwarder?.forwarder} is the optimal choice for shipping ${cargoType} 
      from ${origin} to ${destination} during the ${emergency} situation. 
      Include insights about the TOPSIS score and neutrosophic analysis.
      Keep it engaging and informative, around 200-300 words.`;

      const narrative = await deepseekClient.generateOracleResponse(prompt, context, currentMode);
      setGeneratedNarrative(narrative);
      return narrative;
    } catch (error) {
      console.error('Failed to generate AI narrative:', error);
      return getFallbackNarrative();
    } finally {
      setIsGenerating(false);
    }
  };

  const getFallbackNarrative = () => {
    const narratives = {
      oracular: `🔮 Behold, the cosmic freight matrix has spoken through DeepSeek's ancient algorithms! 
      In the realm where ${emergency} casts shadows over ${destination}, your ${cargoType} cargo carries the weight of destiny. 
      ${topForwarder?.forwarder} emerges not as mere carrier, but as the chosen vessel with TOPSIS score ${topForwarder?.normalizedScore.toFixed(3)}. 
      The neutrosophic truth reveals ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}% certainty in this path. 
      May your cargo reach its destination blessed by the algorithms of logistics wisdom.`,
      
      humorous: `🎭 Alright, let's talk freight like adults who've had too much coffee. 
      Your ${cargoType} needs to get from ${origin} to ${destination}, and it's more urgent than a deadline. 
      ${topForwarder?.forwarder} wins this beauty contest with a TOPSIS score that would make statisticians weep tears of joy. 
      The probability of success is ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}% - better odds than most Netflix shows being good!`,
      
      corporate: `📊 Comprehensive analysis indicates ${topForwarder?.forwarder} demonstrates optimal performance 
      with normalized score ${topForwarder?.normalizedScore.toFixed(3)}. Risk mitigation factors incorporate 
      current ${emergency} situation. Neutrosophic confidence interval: ${(topForwarder?.neutrosophic.truth * 100).toFixed(1)}% reliability. 
      Recommendation aligns with corporate risk management protocols for ${cargoType} transport.`
    };
    
    return narratives[currentMode];
  };

  const speakNarrative = async () => {
    if (isPlaying) {
      stopNarrative();
      return;
    }

    let text = generatedNarrative;
    if (!text) {
      text = await generateAINarrative();
    }

    const voice = unifiedTTS.getVoiceForPersonality(currentMode);
    const emotion = unifiedTTS.getEmotionForPersonality(currentMode);
    
    setIsPlaying(true);
    
    try {
      const audioUrl = await unifiedTTS.generateSpeech(text, {
        voice,
        emotion,
        useRandomSeed: true
      });

      if (audioUrl && audioUrl !== 'browser-speech') {
        const audio = new Audio(audioUrl);
        setAudioElement(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl); // Clean up
        };
        audio.onerror = () => {
          setIsPlaying(false);
          console.error('Audio playback failed');
          URL.revokeObjectURL(audioUrl); // Clean up
        };
        
        await audio.play();
      } else if (audioUrl === 'browser-speech') {
        // Browser speech was used
        setTimeout(() => setIsPlaying(false), 5000); // Longer for narratives
      } else {
        setIsPlaying(false);
        console.error('Failed to generate audio');
      }
    } catch (error) {
      setIsPlaying(false);
      console.error('TTS generation failed:', error);
    }
  };

  const stopNarrative = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return (
    <div className="oracle-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-deepcal-light flex items-center">
          🎙️ DeepCAL Oracle Narration
          <Sparkles className="ml-2 w-5 h-5 text-deepcal-light" />
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={currentMode}
            onChange={(e)=>{
              setCurrentMode(e.target.value as typeof currentMode);
              setGeneratedNarrative(''); // Clear generated narrative when mode changes
            }}
            className="bg-slate-700 text-white px-3 py-1 rounded text-sm border border-slate-600"
            >
            <option value="oracular">🔮 Mystical Oracle</option>
            <option value="humorous">😄 Sarcastic Logistics</option>
            <option value="corporate">📊 Corporate Professional</option>
          </select>
          <button
            onClick={generateAINarrative}
            disabled={isGenerating}
            className="px-3 py-1 bg-deepcal-purple hover:bg-deepcal-dark text-white rounded text-sm disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </button>
          <button
            onClick={speakNarrative}
            disabled={isGenerating}
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
        {generatedNarrative ? (
          <div className="bg-slate-800/50 p-4 rounded border border-slate-600/50">
            <p className="leading-relaxed whitespace-pre-wrap">{generatedNarrative}</p>
          </div>
        ) : (
          <div className="text-slate-400 italic">
            Click "AI Generate" to create a personalized narrative analysis using DeepSeek AI
          </div>
        )}
      </div>

      {(isPlaying || isGenerating) && (
        <div className="mt-4 flex items-center text-xs text-deepcal-light">
          <div className="w-2 h-2 bg-deepcal-light rounded-full mr-2 animate-pulse"></div>
          {isGenerating ? 'DeepSeek generating narrative...' : 'Oracle transmission in progress... (New AI Voice System)'}
        </div>
      )}
    </div>
  );
};
