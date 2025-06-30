
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInterfaceProps {
  onUserMessage: (message: string) => void;
  isProcessing: boolean;
}

export const VoiceInterface = ({ onUserMessage, isProcessing }: VoiceInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Click the microphone to start speaking");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      setStatusMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setStatusMessage("Listening... Speak now");
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart recognition if still in listening mode
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onUserMessage(transcript);
      stopListening();
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      setStatusMessage(`Error: ${event.error}`);
      stopListening();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onUserMessage]);

  const startListening = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      setStatusMessage("Listening... Speak now");
      recognitionRef.current?.start();
    } catch (err) {
      console.error('Microphone access denied:', err);
      setStatusMessage("Microphone access denied. Please allow microphone access to use voice commands.");
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setStatusMessage("Click the microphone to start speaking");
    recognitionRef.current?.stop();
  };

  const toggleMic = () => {
    if (isProcessing) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <button 
        onClick={toggleMic}
        disabled={isProcessing}
        className={`p-4 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-green-500 hover:bg-green-600 pulse-animation' 
            : 'bg-deepcal-purple hover:bg-deepcal-dark'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} text-white shadow-lg`}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>
      
      <div className="text-center text-sm text-slate-400 h-5">
        <span>{statusMessage}</span>
      </div>
    </div>
  );
};
