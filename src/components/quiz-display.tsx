'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GenerateMounjaroQuizOutput } from '@/app/api/ai/generate-mounjaro-quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Option = string | { text: string; image: string };

type QuizQuestion = Omit<GenerateMounjaroQuizOutput['quiz'][0], 'options'> & {
  description?: string;
  isIntroQuestion?: boolean;
  options: Option[];
  layout?: 'default' | 'image-grid' | 'image-options';
  headerText?: {
    timer: string;
    title: string;
    subtitle: string;
  }
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

  const getOptionValue = (option: Option) => {
    return typeof option === 'string' ? option : option.text;
  };

  const getOptionImage = (option: Option) => {
    return typeof option === 'object' ? option.image : '';
  }

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
      // Don't score the intro question if it exists
      if (question.isIntroQuestion) return count;
      return answers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    // Total is the number of questions minus any intro questions
    const totalScorableQuestions = quizData.filter(q => !q.isIntroQuestion).length;

    router.push(`/results?correct=${correctAnswersCount}&total=${totalScorableQuestions}`);
  };

  const renderOptions = () => {
    if (currentQuestion.layout === 'image-grid') {
      return (
        <RadioGroup
          value={answers[currentQuestionIndex]}
          onValueChange={handleAnswerSelect}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {currentQuestion.options.map((option, index) => {
            const opt = typeof option === 'object' ? option : { text: option, image: '' };
            const value = opt.text;
            return (
              <Label
                key={index}
                className="relative flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden [&:has([data-state=checked])]:border-red-600"
              >
                <RadioGroupItem value={value} id={`q${currentQuestionIndex}-o${index}`} className="sr-only" />
                <Image src={opt.image} alt={value} width={400} height={400} className="object-cover w-full h-auto" />
                <div className="absolute bottom-0 w-full bg-red-600 text-white p-3 text-center font-bold flex justify-between items-center">
                  <span>{value}</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      );
    }

    if (currentQuestion.layout === 'image-options') {
      return (
        <RadioGroup
          value={answers[currentQuestionIndex]}
          onValueChange={handleAnswerSelect}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => {
            const value = getOptionValue(option);
            const image = getOptionImage(option);
            return (
              <Label
                key={index}
                className="flex items-center justify-between gap-3 rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={value} id={`q${currentQuestionIndex}-o${index}`} />
                  <span className="font-sans">{value}</span>
                </div>
                {image && (
                  <Image src={image} alt={value} width={80} height={50} className="rounded-md object-contain" />
                )}
              </Label>
            )
          })}
        </RadioGroup>
      )
    }

    return (
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
                    <RadioGroupItem value={getOptionValue(option)} id={`q${currentQuestionIndex}-o${index}`} />
                    <span className="font-sans">{getOptionValue(option)}</span>
                </Label>
            ))}
        </RadioGroup>
    )
  }

  const renderHeaderText = () => {
    if (!currentQuestion.headerText) return null;

    return (
      <div className="text-center mb-6 space-y-4">
        <div className="bg-lime-100 text-green-800 p-2 rounded-lg inline-block">
          <p>{currentQuestion.headerText.timer}</p>
        </div>
        <h2 className="text-2xl font-bold uppercase" dangerouslySetInnerHTML={{ __html: currentQuestion.headerText.title.replace(/(\\d+ a \\d+ KG EM \\d+ DIAS)/, '<span class="text-yellow-500">\$1</span>') }}></h2>
        <p className="text-gray-600">{currentQuestion.headerText.subtitle}</p>
      </div>
    )
  }

  const showProgress = !['image-grid', 'image-options'].includes(currentQuestion.layout || '');

  return (
    <div className="w-full max-w-2xl space-y-4">
       {showProgress && (
        <>
            <div className="flex items-center gap-4">
                <Progress value={progressValue} className="w-full h-2" />
                <p className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                    {currentQuestionIndex + 1} / {quizData.length}
                </p>
            </div>
        </>
      )}

      {currentQuestion.layout !== 'image-grid' && (
        <div className="my-4">
            <Image
                src="https://i.postimg.cc/7h5dMrf9/Screenshot-12.png"
                alt="Etapas do Protocolo"
                width={600}
                height={100}
                className="rounded-lg mx-auto"
            />
        </div>
      )}


      {renderHeaderText()}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">{currentQuestion.question}</CardTitle>
          {currentQuestion.description && !currentQuestion.headerText && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {renderOptions()}
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
