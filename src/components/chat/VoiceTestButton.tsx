
import React, { useState } from 'react';
import { Play, Square, AlertCircle } from 'lucide-react';
import { advancedTTS } from '@/services/advancedTTS';

export const VoiceTestButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastError, setLastError] = useState<string>('');

  const testVoice = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setLastError('');
    
    const testText = "Hello! This is a voice test from DeepCAL Oracle.";
    
    try {
      console.log('🎵 Testing voice with text:', testText);
      
      const audioUrl = await advancedTTS.generateSpeech(testText, {
        voice: 'ballad',
        emotion: 'friendly and clear',
        useRandomSeed: true
      });

      if (audioUrl) {
        console.log('🎵 Got audio URL, creating Audio element...');
        const audio = new Audio(audioUrl);
        
        // Add event listeners for debugging
        audio.addEventListener('loadstart', () => console.log('🎵 Audio: loadstart'));
        audio.addEventListener('canplay', () => console.log('🎵 Audio: canplay'));
        audio.addEventListener('play', () => console.log('🎵 Audio: play started'));
        audio.addEventListener('ended', () => {
          console.log('🎵 Audio: ended');
          setIsPlaying(false);
        });
        audio.addEventListener('error', (e) => {
          console.error('🎵 Audio: error', e);
          setLastError('Audio playback failed');
          setIsPlaying(false);
        });
        
        // Try to play
        await audio.play();
        console.log('🎵 Audio play() called successfully');
      } else {
        setLastError('No audio URL generated');
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
      
      <div className="text-xs text-slate-400 text-center">
        Check browser console for detailed logs
      </div>
    </div>
  );
};
