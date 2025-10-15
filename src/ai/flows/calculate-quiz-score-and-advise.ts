'use server';

/**
 * @fileOverview Calculates the user's quiz score and provides tailored advice based on their performance.
 *
 * - calculateQuizScoreAndAdvise - A function that calculates the quiz score and provides advice.
 * - CalculateQuizScoreAndAdviseInput - The input type for the calculateQuizScoreAndAdvise function.
 * - CalculateQuizScoreAndAdviseOutput - The return type for the calculateQuizScoreAndAdvise function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateQuizScoreAndAdviseInputSchema = z.object({
  correctAnswers: z.number().describe('The number of correct answers.'),
  totalQuestions: z.number().describe('The total number of questions in the quiz.'),
});
export type CalculateQuizScoreAndAdviseInput = z.infer<
  typeof CalculateQuizScoreAndAdviseInputSchema
>;

const CalculateQuizScoreAndAdviseOutputSchema = z.object({
  score: z.number().describe('The user\'s score as a percentage.'),
  advice: z.string().describe('Tailored advice based on the user\'s score.'),
});
export type CalculateQuizScoreAndAdviseOutput = z.infer<
  typeof CalculateQuizScoreAndAdviseOutputSchema
>;

export async function calculateQuizScoreAndAdvise(
  input: CalculateQuizScoreAndAdviseInput
): Promise<CalculateQuizScoreAndAdviseOutput> {
  return calculateQuizScoreAndAdviseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateQuizScoreAndAdvisePrompt',
  input: {schema: CalculateQuizScoreAndAdviseInputSchema},
  output: {schema: CalculateQuizScoreAndAdviseOutputSchema},
  prompt: `You are an expert in evaluating quiz scores and providing helpful advice related to Mounjaro de Pobre.

You will receive the number of correct answers and the total number of questions in a quiz.

Calculate the user\'s score as a percentage.

Based on the score, provide tailored advice to the user. If the score is high, congratulate them and offer advanced tips about the drink. If the score is low, encourage them to study more and provide basic information about Mounjaro de Pobre.

Correct Answers: {{correctAnswers}}
Total Questions: {{totalQuestions}}`,
});

const calculateQuizScoreAndAdviseFlow = ai.defineFlow(
  {
    name: 'calculateQuizScoreAndAdviseFlow',
    inputSchema: CalculateQuizScoreAndAdviseInputSchema,
    outputSchema: CalculateQuizScoreAndAdviseOutputSchema,
  },
  async input => {
    const score = (input.correctAnswers / input.totalQuestions) * 100;
    const {output} = await prompt({...input, score});
    return output!;
  }
);
