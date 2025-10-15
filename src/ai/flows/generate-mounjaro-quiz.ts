'use server';

/**
 * @fileOverview Generates a multiple-choice quiz about Mounjaro de Pobre ingredients and benefits.
 *
 * - generateMounjaroQuiz - A function that generates the quiz.
 * - GenerateMounjaroQuizInput - The input type for the generateMounjaroQuiz function.
 * - GenerateMounjaroQuizOutput - The return type for the generateMounjaroQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMounjaroQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz, should be about Mounjaro de Pobre.'),
  numberOfQuestions: z.number().describe('The number of questions in the quiz.'),
});
export type GenerateMounjaroQuizInput = z.infer<typeof GenerateMounjaroQuizInputSchema>;

const GenerateMounjaroQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers to the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateMounjaroQuizOutput = z.infer<typeof GenerateMounjaroQuizOutputSchema>;

export async function generateMounjaroQuiz(input: GenerateMounjaroQuizInput): Promise<GenerateMounjaroQuizOutput> {
  return generateMounjaroQuizFlow(input);
}

const generateMounjaroQuizPrompt = ai.definePrompt({
  name: 'generateMounjaroQuizPrompt',
  input: {schema: GenerateMounjaroQuizInputSchema},
  output: {schema: GenerateMounjaroQuizOutputSchema},
  prompt: `You are an expert in creating quizzes. Create a multiple-choice quiz about {{topic}} with {{numberOfQuestions}} questions.

The output should be a JSON object with a "quiz" field. Each question in the quiz should have a "question" field, an "options" field with possible answers, and a "correctAnswer" field with the correct answer.

Example:
{
  "quiz": [
    {
      "question": "What is Mounjaro de Pobre?",
      "options": ["A type of exercise", "A healthy drink", "A type of diet", "A medicine"],
      "correctAnswer": "A healthy drink"
    },
   {
      "question": "What are the benefits of Mounjaro de Pobre?",
      "options": ["Weight loss", "Muscle gain", "Improved energy levels", "All of the above"],
      "correctAnswer": "All of the above"
    }
  ]
}`,
});

const generateMounjaroQuizFlow = ai.defineFlow(
  {
    name: 'generateMounjaroQuizFlow',
    inputSchema: GenerateMounjaroQuizInputSchema,
    outputSchema: GenerateMounjaroQuizOutputSchema,
  },
  async input => {
    const {output} = await generateMounjaroQuizPrompt(input);
    return output!;
  }
);
