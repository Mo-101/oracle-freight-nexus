
interface TTSOptions {
  voice: string;
  emotion: string;
  useRandomSeed?: boolean;
}

class NewTTSService {
  private gradioUrl = 'http://localhost:7860'; // Default Gradio service URL
  
  async generateSpeech(text: string, options: TTSOptions): Promise<string | null> {
    try {
      // First try Gradio TTS service
      const gradioResult = await this.tryGradioTTS(text, options);
      if (gradioResult) {
        return gradioResult;
      }

      // Fallback to browser speech synthesis
      return this.tryBrowserSpeech(text, options);
    } catch (error) {
      console.error('TTS generation failed:', error);
      return null;
    }
  }

  private async tryGradioTTS(text: string, options: TTSOptions): Promise<string | null> {
    try {
      const response = await fetch(`${this.gradioUrl}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [text, options.voice, options.emotion],
          fn_index: 0
        })
      });

      if (!response.ok) {
        throw new Error(`Gradio TTS failed: ${response.status}`);
      }

      const result = await response.json();
      return result.data?.[0] || null;
    } catch (error) {
      console.warn('Gradio TTS unavailable, using fallback:', error);
      return null;
    }
  }

  private async tryBrowserSpeech(text: string, options: TTSOptions): Promise<string> {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to match voice to emotion
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(options.voice.toLowerCase())
        ) || voices[0];
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => resolve('browser-speech');
        utterance.onerror = () => resolve('browser-speech');
        
        speechSynthesis.speak(utterance);
      } else {
        resolve('browser-speech');
      }
    });
  }

  // Test connection to Gradio service
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.gradioUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: ['Test connection', 'alloy', 'neutral'],
          fn_index: 0
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const newTTSService = new NewTTSService();
