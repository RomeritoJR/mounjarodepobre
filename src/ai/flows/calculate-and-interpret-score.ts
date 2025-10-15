'use server';

/**
 * @fileOverview Calculates the user's quiz score and provides tailored advice based on their performance.
 *
 * - calculateAndInterpretScore - A function that calculates the quiz score and provides advice.
 * - CalculateAndInterpretScoreInput - The input type for the calculateAndInterpretScore function.
 * - CalculateAndInterpretScoreOutput - The return type for the calculateAndInterpretScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateAndInterpretScoreInputSchema = z.object({
  correctAnswers: z.number().describe('The number of correct answers.'),
  totalQuestions: z.number().describe('The total number of questions in the quiz.'),
});
export type CalculateAndInterpretScoreInput = z.infer<
  typeof CalculateAndInterpretScoreInputSchema
>;

const CalculateAndInterpretScoreOutputSchema = z.object({
  score: z.number().describe('The user\'s score as a percentage.'),
  advice: z.string().describe('Tailored advice based on the user\'s score.'),
});
export type CalculateAndInterpretScoreOutput = z.infer<
  typeof CalculateAndInterpretScoreOutputSchema
>;

export async function calculateAndInterpretScore(
  input: CalculateAndInterpretScoreInput
): Promise<CalculateAndInterpretScoreOutput> {
  return calculateAndInterpretScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateAndInterpretScorePrompt',
  input: {schema: CalculateAndInterpretScoreInputSchema},
  output: {schema: CalculateAndInterpretScoreOutputSchema},
  prompt: `You are an expert in evaluating quiz scores and providing helpful advice.

You will receive the number of correct answers and the total number of questions in a quiz about "Mounjaro de Pobre".

Calculate the user's score as a percentage.

Based on the score, provide tailored advice to the user. If the score is high, congratulate them and offer advanced tips. If the score is low, encourage them to study more and provide basic information.

Correct Answers: {{correctAnswers}}
Total Questions: {{totalQuestions}}`,
});

const calculateAndInterpretScoreFlow = ai.defineFlow(
  {
    name: 'calculateAndInterpretScoreFlow',
    inputSchema: CalculateAndInterpretScoreInputSchema,
    outputSchema: CalculateAndInterpretScoreOutputSchema,
  },
  async input => {
    const score = (input.correctAnswers / input.totalQuestions) * 100;
    const {output} = await prompt({...input, score});
    return output!;
  }
);
