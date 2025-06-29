
import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { advancedTTS } from '@/services/advancedTTS';

interface VoiceChatProps {
  onSpeakResponse: (text: string) => void;
  isEnabled: boolean;
}

export const VoiceChat = ({ onSpeakResponse, isEnabled }: VoiceChatProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    if (isPlaying) {
      stopSpeaking();
      return;
    }

    setIsPlaying(true);
    
    try {
      const audioUrl = await advancedTTS.generateSpeech(text, {
        voice: 'ballad',
        emotion: 'mystical, wise and conversational',
        useRandomSeed: true
      });

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        
        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      setIsPlaying(false);
      console.error('Voice playback failed:', error);
    }
  };

  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  if (!isEnabled) return null;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => speakText("Voice chat activated. The Oracle is ready to speak.")}
        className={`p-2 rounded-full transition-colors ${
          isPlaying 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-deepcal-purple hover:bg-deepcal-dark text-white'
        }`}
        title={isPlaying ? "Stop speaking" : "Speak with Oracle voice"}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
