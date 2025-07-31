export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  samples: any[];
  category: string;
  fine_tuning: {
    model_id: string | null;
    is_allowed_to_fine_tune: boolean;
    state: any;
    verification_failures: any[];
    verification_attempts_count: number;
    manual_verification: any;
    manual_verification_requested: boolean;
  };
  labels: any;
  description: string | null;
  preview_url: string | null;
  available_for_tiers: any[];
  settings: any | null;
  sharing: any | null;
  high_quality_base_model_ids: string[];
}

export async function getElevenLabsVoices(apiKey: string): Promise<ElevenLabsVoice[]> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }
    
    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    return [];
  }
}

export async function generateSpeech(
  apiKey: string,
  voiceId: string,
  text: string,
  settings = { stability: 0.5, similarity_boost: 0.5, style: 0.5 }
) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: settings,
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  return response.arrayBuffer();
}