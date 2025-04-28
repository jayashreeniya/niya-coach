import { openai } from './messageProcessingService';

export interface BurnoutResult {
  score: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  recommendation: string;
  requiresProfessionalHelp: boolean;
}

export const analyzeBurnoutScore = (score: number): BurnoutResult => {
  let severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  let requiresProfessionalHelp = false;

  // Score ranges from 10-50
  if (score <= 20) {
    severity = 'Low';
  } else if (score <= 30) {
    severity = 'Moderate';
  } else if (score <= 40) {
    severity = 'High';
    requiresProfessionalHelp = true;
  } else {
    severity = 'Severe';
    requiresProfessionalHelp = true;
  }

  return {
    score,
    severity,
    recommendation: '', // Will be filled by GPT
    requiresProfessionalHelp
  };
};

export const getDetailedRecommendations = async (
  result: BurnoutResult,
  answers: number[]
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a burnout management expert providing personalized recommendations. 
          The user has completed a burnout assessment with the following results:
          - Overall Score: ${result.score}/50
          - Severity Level: ${result.severity}
          
          Guidelines for recommendations:
          - Be empathetic and supportive
          - Provide specific, actionable advice
          - Include both immediate and long-term strategies
          - Focus on work-life balance
          - Suggest lifestyle modifications
          - Recommend professional help if severity is High or Severe
          
          Structure your response in these sections:
          1. Assessment Summary
          2. Key Areas of Concern
          3. Immediate Actions
          4. Long-term Strategies
          5. Professional Support (if needed)
          
          Keep the tone warm and supportive while maintaining professionalism.`
        },
        {
          role: "user",
          content: `Please provide detailed recommendations based on this burnout assessment score: ${result.score} (${result.severity} severity).
          
          Individual question scores (1-5 scale):
          1. Tiredness: ${answers[0]}
          2. Physical exhaustion: ${answers[1]}
          3. Emotional exhaustion: ${answers[2]}
          4. Feeling overwhelmed: ${answers[3]}
          5. Worn out: ${answers[4]}
          6. Physical weakness: ${answers[5]}
          7. End of day exhaustion: ${answers[6]}
          8. Morning exhaustion: ${answers[7]}
          9. Work hour fatigue: ${answers[8]}
          10. Energy for personal life: ${answers[9]} (reverse scored)`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || 
      'Unable to generate recommendations. Please consult with a healthcare professional for personalized advice.';
  } catch (error) {
    console.error('Error generating burnout recommendations:', error);
    throw new Error('Failed to generate burnout recommendations');
  }
};

export const saveBurnoutAssessment = async (
  userId: string,
  result: BurnoutResult,
  answers: number[]
) => {
  // TODO: Implement saving assessment results to database
  console.log('Saving burnout assessment:', { userId, result, answers });
}; 