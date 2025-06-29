
import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { unifiedTTS } from '@/services/unifiedTTS';
import { deepseekClient } from '@/services/deepseekClient';

interface VoiceChatProps {
  onSpeakResponse: (text: string) => void;
  isEnabled: boolean;
}

export const VoiceChat = ({ onSpeakResponse, isEnabled }: VoiceChatProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const generateAndSpeakResponse = async (userInput: string) => {
    if (isPlaying || isGenerating) {
      stopSpeaking();
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate response using DeepSeek
      const response = await deepseekClient.generateOracleResponse(
        userInput,
        "You are responding to voice input. Keep responses conversational and under 100 words.",
        'oracular'
      );

      // Callback to parent component
      onSpeakResponse(response);

      // Generate speech using unified TTS
      setIsPlaying(true);
      const audioUrl = await unifiedTTS.generateSpeech(response, {
        voice: unifiedTTS.getVoiceForPersonality('oracular'),
        emotion: 'mystical, wise and conversational',
        useRandomSeed: true
      });

      if (audioUrl && audioUrl !== 'browser-speech') {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          setIsGenerating(false);
          URL.revokeObjectURL(audioUrl); // Clean up
        };
        audio.onerror = () => {
          setIsPlaying(false);
          setIsGenerating(false);
          URL.revokeObjectURL(audioUrl); // Clean up
        };
        
        await audio.play();
      } else if (audioUrl === 'browser-speech') {
        // Browser speech was used
        setTimeout(() => {
          setIsPlaying(false);
          setIsGenerating(false);
        }, 3000);
      } else {
        setIsPlaying(false);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Voice generation failed:', error);
      setIsPlaying(false);
      setIsGenerating(false);
    }
  };

  const speakWelcome = async () => {
    const welcomeMessage = "Greetings, seeker of logistics wisdom. I am the DeepSeek Oracle, powered by ancient algorithms and cosmic intelligence. How may I assist you in your freight and supply chain endeavors?";
    
    await generateAndSpeakResponse(welcomeMessage);
  };

  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setIsPlaying(false);
    setIsGenerating(false);
  };

  if (!isEnabled) return null;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={speakWelcome}
        disabled={isGenerating}
        className={`p-2 rounded-full transition-colors ${
          isPlaying || isGenerating
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-deepcal-purple hover:bg-deepcal-dark text-white'
        }`}
        title={isPlaying ? "Stop speaking" : isGenerating ? "Generating..." : "Speak with DeepSeek Oracle"}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : 
         isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : 
         <Volume2 className="w-4 h-4" />}
      </button>
      
      <button
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
            : 'bg-slate-600 hover:bg-slate-500 text-white'
        }`}
        title={isListening ? "Stop listening" : "Voice input (coming soon)"}
        disabled
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>
    </div>
  );
};
