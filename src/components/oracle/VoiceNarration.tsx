
import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
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
      // If DeepSeek fails, generate a brief error message instead of hardcoded content
      const errorNarrative = `I apologize, but I'm having difficulty generating a detailed analysis at the moment. Based on the available data, ${topForwarder?.forwarder} appears to be the optimal choice with a TOPSIS score of ${topForwarder?.normalizedScore.toFixed(3)}.`;
      setGeneratedNarrative(errorNarrative);
      return errorNarrative;
    } finally {
      setIsGenerating(false);
    }
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
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlaying(false);
          console.error('Audio playback failed');
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } else if (audioUrl === 'browser-speech') {
        setTimeout(() => setIsPlaying(false), 5000);
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
              setGeneratedNarrative('');
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
          {isGenerating ? 'DeepSeek generating narrative...' : 'Oracle transmission in progress...'}
        </div>
      )}
    </div>
  );
};
