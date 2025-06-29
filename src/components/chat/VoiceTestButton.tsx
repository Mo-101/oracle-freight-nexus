
import React, { useState } from 'react';
import { Play, Square, AlertCircle, Settings } from 'lucide-react';
import { unifiedTTS } from '@/services/unifiedTTS';

export const VoiceTestButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const testVoice = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setLastError('');
    
    const testText = "Hello! This is a voice test from DeepCAL Oracle using advanced AI speech synthesis.";
    
    try {
      console.log('🎵 Testing voice with text:', testText);
      
      const audioUrl = await unifiedTTS.generateSpeech(testText, {
        voice: '9BWtsMINqrJLrRacOk9x', // Aria voice
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
        setLastError('No audio generated - check API key');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('🎵 Voice test failed:', error);
      setLastError(error instanceof Error ? error.message : 'Unknown error');
      setIsPlaying(false);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      // Store API key in localStorage for this session
      localStorage.setItem('elevenlabs_api_key', apiKey.trim());
      // Reload the page to pick up the new API key
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
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

        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition"
          title="Configure ElevenLabs API Key"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {showApiKeyInput && (
        <div className="flex items-center space-x-2 bg-slate-800 p-3 rounded-lg">
          <input
            type="password"
            placeholder="ElevenLabs API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-slate-700 text-white px-3 py-1 rounded text-sm flex-1"
          />
          <button
            onClick={handleApiKeySubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Save
          </button>
        </div>
      )}
      
      {lastError && (
        <div className="flex items-center space-x-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{lastError}</span>
        </div>
      )}
      
      <div className="text-xs text-slate-400 text-center max-w-xs">
        {lastError.includes('API key') ? (
          <span className="text-amber-400">
            Add your ElevenLabs API key for high-quality voice synthesis
          </span>
        ) : (
          'Uses ElevenLabs (premium) → F5-TTS → Browser speech (fallback)'
        )}
      </div>
    </div>
  );
};
