
import React, { useState } from 'react';
import { Play, Square, AlertCircle } from 'lucide-react';
import { unifiedTTS } from '@/services/unifiedTTS';

export const VoiceTestButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastError, setLastError] = useState<string>('');

  const testVoice = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setLastError('');
    
    const testText = "Hello! This is a voice test from DeepCAL Oracle using Kokoro TTS.";
    
    try {
      console.log('🎵 Testing voice with text:', testText);
      
      const audioUrl = await unifiedTTS.generateSpeech(testText, {
        voice: 'af_sarah',
        emotion: 'friendly and clear',
        useRandomSeed: true
      });

      if (audioUrl && audioUrl !== 'browser-speech') {
        console.log('🎵 Got audio URL, creating Audio element...');
        const audio = new Audio(audioUrl);
        
        // Add event listeners for debugging
        audio.addEventListener('loadstart', () => console.log('🎵 Audio: loadstart'));
        audio.addEventListener('canplay', () => console.log('🎵 Audio: canplay'));
        audio.addEventListener('play', () => console.log('🎵 Audio: play started'));
        audio.addEventListener('ended', () => {
          console.log('🎵 Audio: ended');
          setIsPlaying(false);
          // Clean up object URL to prevent memory leaks
          URL.revokeObjectURL(audioUrl);
        });
        audio.addEventListener('error', (e) => {
          console.error('🎵 Audio: error', e);
          setLastError('Audio playback failed');
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        });
        
        // Try to play
        await audio.play();
        console.log('🎵 Audio play() called successfully');
      } else if (audioUrl === 'browser-speech') {
        // Browser speech synthesis was used
        setTimeout(() => setIsPlaying(false), 3000); // Approximate duration
      } else {
        setLastError('Kokoro-TTS service unavailable');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('🎵 Voice test failed:', error);
      setLastError(error instanceof Error ? error.message : 'Unknown error');
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={testVoice}
        disabled={isPlaying}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
          isPlaying 
            ? 'bg-yellow-600 text-white cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span>{isPlaying ? 'Testing...' : 'Test Voice'}</span>
      </button>
      
      {lastError && (
        <div className="flex items-center space-x-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{lastError}</span>
        </div>
      )}
      
      <div className="text-xs text-slate-400 text-center max-w-xs">
        Free Kokoro-TTS → Browser speech (fallback)
      </div>
    </div>
  );
};
