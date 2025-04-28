import axios from 'axios';

const GOOGLE_TTS_API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

interface TTSRequest {
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    ssmlGender: string;
  };
  audioConfig: {
    audioEncoding: string;
    speakingRate: number;
    pitch: number;
    volumeGainDb: number;
  };
}

export const synthesizeSpeech = async (text: string, language: string = 'en-US'): Promise<ArrayBuffer> => {
  try {
    // Map language codes to Google Cloud format
    const languageMap: { [key: string]: string } = {
      // Indian Languages
      'ta': 'ta-IN', // Tamil
      'hi': 'hi-IN', // Hindi
      'bn': 'bn-IN', // Bengali
      'te': 'te-IN', // Telugu
      'mr': 'mr-IN', // Marathi
      'gu': 'gu-IN', // Gujarati
      'kn': 'kn-IN', // Kannada
      'ml': 'ml-IN', // Malayalam
      'pa': 'pa-IN', // Punjabi
      'or': 'or-IN', // Odia (Oriya)
      'as': 'as-IN', // Assamese
      'ur': 'ur-IN', // Urdu
      
      // Default English variants
      'en': 'en-US',
      'en-IN': 'en-IN', // Indian English
    };

    const request: TTSRequest = {
      input: { text },
      voice: {
        languageCode: languageMap[language] || language,
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 0,
        volumeGainDb: 0
      }
    };

    const response = await axios.post(
      GOOGLE_TTS_API_URL,
      request,
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GOOGLE_CLOUD_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Convert base64 audio content to ArrayBuffer
    const audioContent = response.data.audioContent;
    const binaryString = atob(audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
}; 