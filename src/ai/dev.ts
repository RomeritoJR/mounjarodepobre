import { config } from 'dotenv';
config();

import '@/ai/flows/calculate-and-interpret-score.ts';
import '@/ai/flows/generate-mounjaro-quiz.ts';
import '@/ai/flows/calculate-quiz-score-and-advise.ts';