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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

type DetailedOption = { title: string; description: string; };
type Option = string | { text: string; image: string } | DetailedOption;

type QuizQuestion = Omit<GenerateMounjaroQuizOutput['quiz'][0], 'options'> & {
  description?: string;
  isIntroQuestion?: boolean;
  isInfoStep?: boolean;
  image?: string;
  infoTitle?: string;
  infoBody?: string;
  buttonText?: string;
  carouselImages?: string[];
  options: Option[];
  layout?: 'default' | 'image-grid' | 'image-options' | 'detailed';
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

  const isDetailedOption = (option: Option): option is DetailedOption => {
    return typeof option === 'object' && 'title' in option && 'description' in option;
  }

  const getOptionValue = (option: Option) => {
    if (typeof option === 'string') return option;
    if (isDetailedOption(option)) return option.title;
    return option.text;
  };

  const getOptionImage = (option: Option) => {
    return typeof option === 'object' && 'image' in option ? option.image : '';
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
      if (question.isIntroQuestion || question.isInfoStep) return count;
      return answers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    // Total is the number of questions minus any intro or info questions
    const totalScorableQuestions = quizData.filter(q => !q.isIntroQuestion && !q.isInfoStep).length;

    router.push(`/results?correct=${correctAnswersCount}&total=${totalScorableQuestions}`);
  };

  if (currentQuestion.isInfoStep) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            {currentQuestion.infoTitle && (
              <h2 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: currentQuestion.infoTitle }} />
            )}
             {currentQuestion.image && (
              <div className="my-4">
                <Image 
                  src={currentQuestion.image}
                  alt="Informational Step"
                  width={600}
                  height={400}
                  className="rounded-lg mx-auto"
                />
              </div>
            )}
             {currentQuestion.carouselImages && (
              <Carousel className="w-full max-w-xs mx-auto my-4" opts={{ loop: true }}>
                <CarouselContent>
                  {currentQuestion.carouselImages.map((src, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={src}
                        alt={`Depoimento ${index + 1}`}
                        width={400}
                        height={400}
                        className="rounded-lg object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
            {currentQuestion.infoBody && (
              <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: currentQuestion.infoBody }} />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleNext}>
              {currentQuestion.buttonText || 'Continuar'}
              <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const renderOptions = () => {
    if (currentQuestion.layout === 'image-grid') {
      return (
        <RadioGroup
          value={answers[currentQuestionIndex]}
          onValueChange={handleAnswerSelect}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {currentQuestion.options.map((option, index) => {
            const opt = typeof option === 'object' && 'text' in option ? option : { text: getOptionValue(option), image: '' };
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

    if (currentQuestion.layout === 'detailed') {
      return (
        <RadioGroup
            value={answers[currentQuestionIndex]}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
        >
            {currentQuestion.options.map((option, index) => {
              if (!isDetailedOption(option)) return null;
              const value = getOptionValue(option);
              return (
                <Label
                    key={index}
                    className="flex items-start gap-3 rounded-md border p-4 hover:bg-accent/50 transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
                >
                    <RadioGroupItem value={value} id={`q${currentQuestionIndex}-o${index}`} className="mt-1" />
                    <div>
                      <p className="font-sans font-semibold">{option.title}</p>
                      <p className="font-sans text-sm text-muted-foreground">{option.description}</p>
                    </div>
                </Label>
              )
            })}
        </RadioGroup>
      )
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
        <h2 className="text-2xl font-bold uppercase" dangerouslySetInnerHTML={{ __html: currentQuestion.headerText.title.replace(/(\\d+ a \\d+ KG EM \\d+ DIAS)/, '<span class="text-yellow-500">$1</span>') }}></h2>
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

      {currentQuestionIndex === 0 && (
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
      
      {currentQuestionIndex === 2 && (
        <div className="my-4">
            <Image
                src="https://i.postimg.cc/63FqhwYF/Screenshot-4.png"
                alt="Áreas do corpo"
                width={600}
                height={100}
                className="rounded-lg mx-auto"
            />
        </div>
      )}
      
      {currentQuestionIndex === 3 && (
        <div className="my-4">
            <Image
                src="https://i.postimg.cc/VvMqqKBV/img12.jpg"
                alt="Mulher feliz"
                width={600}
                height={400}
                className="rounded-lg mx-auto"
            />
        </div>
      )}
      
      {currentQuestionIndex === 4 && (
        <div className="my-4">
            <Image
                src="https://i.postimg.cc/cL6JPrPG/Screenshot-18.png"
                alt="O que te impede de emagrecer"
                width={600}
                height={400}
                className="rounded-lg mx-auto"
            />
        </div>
      )}
      
      {currentQuestionIndex === 6 && (
        <div className="my-4">
            <Image
                src="https://i.postimg.cc/Jn0Kk3Fz/Screenshot-8.png"
                alt="Benefícios"
                width={600}
                height={400}
                className="rounded-lg mx-auto"
            />
        </div>
      )}


      {renderHeaderText()}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">{currentQuestion.question}</CardTitle>
          {currentQuestion.description && (
            <CardDescription className="text-center">{currentQuestion.description}</CardDescription>
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
