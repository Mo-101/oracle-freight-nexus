
interface TTSConfig {
  voice: string;
  emotion: string;
  useRandomSeed: boolean;
  specificSeed?: number;
}

class AdvancedTTS {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://hysts-mcp-kokoro-tts.hf.space') {
    this.baseUrl = baseUrl;
  }

  async generateSpeech(
    text: string, 
    config: TTSConfig = {
      voice: 'default',
      emotion: 'neutral',
      useRandomSeed: true
    }
  ): Promise<string | null> {
    try {
      console.log('🎵 Kokoro-TTS: Starting speech generation...');
      console.log('🎵 Text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      console.log('🎵 Config:', config);
      
      // Kokoro-TTS API format - simplified for basic text-to-speech
      const payload = {
        data: [
          text,           // Text to synthesize
          "af",           // Voice style (default)
          1.0,            // Speed
          1.0             // Volume
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
        console.error('🎵 Kokoro-TTS API Error Response:', errorText);
        throw new Error(`Kokoro-TTS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🎵 Kokoro-TTS API Full Response:', result);

      // The Kokoro-TTS API returns data in the format: { data: [audioFileUrl] }
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
      console.error('🎵 Kokoro-TTS Error:', error);
      
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
      "af", "af_bella", "af_nicole", "af_sarah", "af_sky"
    ];
  }
}

export const advancedTTS = new AdvancedTTS();
