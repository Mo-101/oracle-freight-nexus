
interface ElevenLabsConfig {
  voice?: string;
  model?: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

class ElevenLabsTTS {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_ELEVENLABS_API_KEY || '';
  }

  async generateSpeech(
    text: string,
    config: ElevenLabsConfig = {}
  ): Promise<string | null> {
    if (!this.apiKey) {
      console.warn('🎵 ElevenLabs: No API key provided');
      return null;
    }

    try {
      console.log('🎵 ElevenLabs: Starting speech generation...');
      console.log('🎵 Text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      console.log('🎵 Config:', config);

      // Default to Aria voice if none specified
      const voiceId = config.voice || '9BWtsMINqrJLrRacOk9x';
      const model = config.model || 'eleven_multilingual_v2';

      const url = `${this.baseUrl}/text-to-speech/${voiceId}`;
      
      const payload = {
        text: text,
        model_id: model,
        voice_settings: {
          stability: config.stability || 0.5,
          similarity_boost: config.similarity_boost || 0.8,
          style: config.style || 0.0,
          use_speaker_boost: config.use_speaker_boost || true
        }
      };

      console.log('🎵 Sending request to:', url);
      console.log('🎵 Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      console.log('🎵 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 ElevenLabs API Error Response:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      // Convert response to blob and create object URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('🎵 Generated audio URL:', audioUrl);
      return audioUrl;

    } catch (error) {
      console.error('🎵 ElevenLabs Error:', error);
      return null;
    }
  }

  getVoiceForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    const voiceMap = {
      oracular: '9BWtsMINqrJLrRacOk9x', // Aria - mystical, clear
      humorous: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - casual, friendly
      corporate: 'onwK4e9ZLuTAKqWW03F9'  // Daniel - professional
    };
    return voiceMap[personality];
  }

  getAvailableVoices() {
    return [
      { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria' },
      { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
      { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura' },
      { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie' },
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam' },
      { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' }
    ];
  }
}

export const elevenLabsTTS = new ElevenLabsTTS();
