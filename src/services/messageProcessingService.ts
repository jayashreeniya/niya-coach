import OpenAI from 'openai';

// Initialize OpenAI with your API key
const initializeOpenAI = () => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, you should use a backend service
  });
};

let openai: OpenAI;
try {
  openai = initializeOpenAI();
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
}

interface EmotionalAnalysis {
  severity: number;
  primaryEmotion: string;
  requiresProfessionalHelp: boolean;
  recommendation: string;
}

interface ProcessedMessage {
  text: string;
  detectedLanguage: string;
  emotionalSeverity: number;
  emotionalAnalysis: EmotionalAnalysis;
  audioResponse?: Blob;
}

export const processAudioMessage = async (audioBlob: Blob): Promise<ProcessedMessage> => {
  try {
    if (!openai) {
      throw new Error('OpenAI client is not initialized. Please check your API key configuration.');
    }

    // Use OpenAI's Whisper API for speech-to-text with language detection
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBlob], 'audio.wav', { type: 'audio/wav' }),
      model: 'whisper-1',
      response_format: 'json'
    });

    // Detect language using the text processing function
    const languageResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a language detector. Respond only with the ISO language code (e.g., 'en', 'es', 'fr', etc.) for the following text. Do not include any other text in your response."
        },
        {
          role: "user",
          content: transcription.text
        }
      ],
      temperature: 0.3,
      max_tokens: 10,
      response_format: { type: "text" }
    });

    const detectedLanguage = languageResponse.choices[0]?.message?.content?.trim().toLowerCase() || 'en';

    // Analyze emotional content
    const emotionalAnalysis = await analyzeEmotionalContent(transcription.text);

    return {
      text: transcription.text,
      detectedLanguage,
      emotionalSeverity: emotionalAnalysis.severity,
      emotionalAnalysis
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or not configured properly. Please check your settings.');
      }
      if (error.message.includes('response_format')) {
        throw new Error('Invalid response format configuration. Please check API settings.');
      }
      throw new Error(`Failed to process audio: ${error.message}`);
    }
    throw new Error('Failed to process audio: Unknown error');
  }
};

export const processTextMessage = async (text: string): Promise<ProcessedMessage> => {
  try {
    if (!openai) {
      throw new Error('OpenAI client is not initialized. Please check your API key configuration.');
    }

    // Use OpenAI to detect language with specific focus on Tamil
    const languageResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a language detector specialized in identifying languages, with particular expertise in South Asian languages.
          
          Important rules:
          - For Tamil text, ALWAYS return 'ta'
          - For English text, return 'en'
          - For mixed Tamil-English text, if there's any Tamil, return 'ta'
          - Respond ONLY with the ISO language code (e.g., 'ta', 'en', 'hi', etc.)
          - Do not include any other text in your response
          
          Examples:
          - "வணக்கம்" -> "ta"
          - "Hello" -> "en"
          - "நான் fine" -> "ta"
          - "எப்படி இருக்கிறீர்கள்?" -> "ta"`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1, // Lower temperature for more consistent results
      max_tokens: 10,
      response_format: { type: "text" }
    });

    const detectedLanguage = languageResponse.choices[0]?.message?.content?.trim().toLowerCase() || 'en';
    
    // Analyze emotional content
    const emotionalAnalysis = await analyzeEmotionalContent(text);

    return {
      text,
      detectedLanguage,
      emotionalSeverity: emotionalAnalysis.severity,
      emotionalAnalysis
    };
  } catch (error) {
    console.error('Error processing text:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or not configured properly. Please check your settings.');
      }
      if (error.message.includes('response_format')) {
        throw new Error('Invalid response format configuration. Please check API settings.');
      }
      throw new Error(`Failed to process text: ${error.message}`);
    }
    throw new Error('Failed to process text: Unknown error');
  }
};

const analyzeEmotionalContent = async (text: string): Promise<EmotionalAnalysis> => {
  if (!text.trim()) {
    throw new Error('Empty text provided for emotional analysis');
  }

  if (!openai) {
    throw new Error('OpenAI client is not initialized');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert mental health professional specialized in emotional analysis and crisis detection, with support for multiple languages including Tamil.
          
          Analyze the following text and provide a response in this EXACT format (numbers and text only, no labels):
          
          [severity_number]
          [primary_emotion]
          [true_or_false]
          [recommendation]

          Guidelines for severity (0-10):
          - 8-10: Crisis situation, immediate professional help needed
          - 6-7: High distress, professional help strongly recommended
          - 4-5: Moderate distress, monitoring needed
          - 0-3: Mild or no distress

          For Tamil text:
          - Understand common Tamil emotional expressions
          - Consider cultural context in emotional assessment
          - Provide severity based on Tamil emotional expressions
          - Example: "மனசு ரொம்ப கஷ்டமா இருக்கு" indicates high distress

          Look for indicators of:
          - Suicidal thoughts or self-harm
          - Severe anxiety or panic
          - Deep depression
          - Burnout symptoms
          - Emotional overwhelm
          - Professional or personal crisis`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: "text" }
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      // Split the response into lines and parse each component
      const lines = responseContent.trim().split('\n').map(line => line.trim());
      if (lines.length < 4) {
        throw new Error('Invalid response format: insufficient lines');
      }

      const severity = parseFloat(lines[0]);
      const primaryEmotion = lines[1];
      const requiresProfessionalHelp = lines[2].toLowerCase() === 'true';
      const recommendation = lines[3];

      // Validate the parsed response
      if (
        isNaN(severity) ||
        !primaryEmotion ||
        typeof requiresProfessionalHelp !== 'boolean' ||
        !recommendation
      ) {
        throw new Error('Invalid emotional analysis response format');
      }

      return {
        severity,
        primaryEmotion,
        requiresProfessionalHelp,
        recommendation
      };
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse emotional analysis response: Invalid format');
    }
  } catch (error) {
    console.error('Error in emotional analysis:', error);
    if (error instanceof Error) {
      if (error.message.includes('response_format')) {
        throw new Error('Invalid response format configuration. Please check API settings.');
      }
      throw new Error(`Failed to analyze emotional content: ${error.message}`);
    }
    throw new Error('Failed to analyze emotional content: Unknown error');
  }
};

export const generateAIResponse = async (message: string, language: string, emotionalAnalysis: EmotionalAnalysis): Promise<string> => {
  try {
    // Validate language code
    if (!language || language.length < 2) {
      throw new Error('Invalid language code provided');
    }

    if (!openai) {
      throw new Error('OpenAI client is not initialized');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are NIYA, a helpful and empathetic AI coach specialized in mental health and emotional support. 
          Current emotional state: ${emotionalAnalysis.primaryEmotion} (Severity: ${emotionalAnalysis.severity}/10)
          
          Guidelines:
          - Respond in ${language} language only
          - Be warm, friendly, and genuinely interested
          - Validate their emotions and experiences
          - Ask open-ended questions to encourage sharing
          - Keep responses conversational and natural
          - Aim for responses between 2-3 sentences
          
          Response style based on emotional state:
          - For positive emotions (good, happy, great): Share their joy, ask what's contributing to their good mood
          - For neutral emotions (ok, fine): Show curiosity, gently explore if there's anything on their mind
          - For challenging emotions (stressed, anxious): Offer empathy, validate feelings, and provide gentle support
          
          Always:
          - Be warm and empathetic
          - Validate emotions
          - Ask engaging follow-up questions
          - Keep responses concise but meaningful
          - Format response conversationally
          
          If severity is high (7+), gently encourage professional support: https://book-appointment.niya.app/`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "text" }
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('Empty response from AI');
    }

    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (error instanceof Error) {
      if (error.message.includes('response_format')) {
        throw new Error('Invalid response format configuration. Please check API settings.');
      }
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
    throw new Error('Failed to generate AI response: Unknown error');
  }
};

export { openai }; 