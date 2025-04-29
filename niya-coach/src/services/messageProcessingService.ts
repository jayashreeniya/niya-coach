import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend service
});

interface ProcessedMessage {
  text: string;
  detectedLanguage: string;
}

export const processAudioMessage = async (audioBlob: Blob): Promise<ProcessedMessage> => {
  try {
    // Convert audio blob to base64
    const reader = new FileReader();
    const audioBase64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(audioBlob);
    });

    // Use OpenAI's Whisper API for speech-to-text
    const response = await openai.audio.transcriptions.create({
      file: new File([audioBlob], 'audio.wav', { type: 'audio/wav' }),
      model: 'whisper-1'
    });

    // Detect language using the text content
    const languageResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a language detector. Respond only with the ISO language code (e.g., 'en', 'es', 'fr', etc.) for the following text."
        },
        {
          role: "user",
          content: response.text
        }
      ]
    });

    return {
      text: response.text,
      detectedLanguage: languageResponse.choices[0]?.message?.content?.trim() || 'en'
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

export const processTextMessage = async (text: string): Promise<ProcessedMessage> => {
  try {
    // Use OpenAI to detect language and process text
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that processes messages. Detect the language and return the original text."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return {
      text: text,
      detectedLanguage: response.choices[0]?.message?.content || 'en'
    };
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
};

export const generateAIResponse = async (message: string, language: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful coach assistant. Respond in the same language as the user (${language}). Focus on providing supportive and practical advice for burnout and mental health.`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return response.choices[0]?.message?.content || 'I apologize, but I am unable to process your request at the moment.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}; 