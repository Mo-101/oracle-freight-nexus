interface TTSConfig {
  voice: string;
  emotion: string;
  useRandomSeed: boolean;
  specificSeed?: number;
}

class AdvancedTTS {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://mrfakename-f5-tts.hf.space') {
    this.baseUrl = baseUrl;
  }

  async generateSpeech(
    text: string, 
    config: TTSConfig = {
      voice: 'ballad',
      emotion: 'mystical and wise',
      useRandomSeed: true
    }
  ): Promise<string | null> {
    try {
      console.log('🎵 F5-TTS: Starting speech generation...');
      console.log('🎵 Text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      console.log('🎵 Config:', config);
      
      // F5-TTS API format
      const payload = {
        data: [
          text,           // Text to synthesize
          null,           // No reference audio (for voice cloning)
          "F5-TTS_v1"     // Model name
        ]
      };

      console.log('🎵 Sending request to:', `${this.baseUrl}/run/predict`);
      console.log('🎵 Payload:', payload);

      const response = await fetch(`${this.baseUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('🎵 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 F5-TTS API Error Response:', errorText);
        throw new Error(`F5-TTS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🎵 F5-TTS API Full Response:', result);

      // The F5-TTS API returns data in the format: { data: [audioFileUrl] }
      if (result.data && result.data[0]) {
        const audioUrl = result.data[0];
        console.log('🎵 Generated audio URL:', audioUrl);
        console.log('🎵 Audio URL type:', typeof audioUrl);
        
        // Test if the audio URL is accessible
        try {
          const audioTestResponse = await fetch(audioUrl, { method: 'HEAD' });
          console.log('🎵 Audio URL test:', audioTestResponse.status, audioTestResponse.statusText);
        } catch (testError) {
          console.error('🎵 Audio URL test failed:', testError);
        }
        
        return audioUrl;
      } else {
        console.error('🎵 No audio URL in response. Full response:', result);
        return null;
      }
    } catch (error) {
      console.error('🎵 F5-TTS Error:', error);
      
      // Try a fallback test with browser speech synthesis
      console.log('🎵 Attempting browser speech synthesis fallback...');
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text.substring(0, 200));
          utterance.rate = 0.8;
          utterance.pitch = 1.1;
          window.speechSynthesis.speak(utterance);
          console.log('🎵 Browser speech synthesis triggered as fallback');
        }
      } catch (fallbackError) {
        console.error('🎵 Browser speech synthesis also failed:', fallbackError);
      }
      
      return null;
    }
  }

  getEmotionForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    const emotionMap = {
      oracular: 'mystical, ancient wisdom with reverent tone',
      humorous: 'witty, sarcastic and playful',
      corporate: 'professional, authoritative and confident'
    };
    return emotionMap[personality];
  }

  getAvailableVoices(): string[] {
    return [
      "default", "natural", "expressive"
    ];
  }
}

export const advancedTTS = new AdvancedTTS();
