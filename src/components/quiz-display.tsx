'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GenerateMounjaroQuizOutput } from '@/app/api/ai/generate-mounjaro-quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

type QuizQuestion = GenerateMounjaroQuizOutput['quiz'][0] & {
  description?: string;
  isIntroQuestion?: boolean;
};

type QuizDisplayProps = {
  quizData: QuizQuestion[];
};

export default function QuizDisplay({ quizData }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizData.length).fill(''));
  const router = useRouter();

  const currentQuestion = quizData[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex) / quizData.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    const correctAnswersCount = quizData.reduce((count, question, index) => {
      // Don't score the intro question
      if (question.isIntroQuestion) return count;
      return answers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    // Total is the number of questions minus the intro one
    const totalScorableQuestions = quizData.filter(q => !q.isIntroQuestion).length;

    router.push(`/results?correct=${correctAnswersCount}&total=${totalScorableQuestions}`);
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center gap-4">
        <Progress value={progressValue} className="w-full h-2" />
        <p className="text-sm text-muted-foreground font-medium whitespace-nowrap">
          {currentQuestionIndex + 1} / {quizData.length}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{currentQuestion.question}</CardTitle>
          {currentQuestion.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestionIndex]}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <Label
                key={index}
                className="flex items-center gap-3 rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
              >
                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                <span className="font-sans">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
            <ArrowLeft />
            Anterior
          </Button>
          {currentQuestionIndex < quizData.length - 1 ? (
            <Button onClick={handleNext} disabled={!answers[currentQuestionIndex]}>
              Próxima
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!answers[currentQuestionIndex]}>
              Finalizar
              <Check />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
