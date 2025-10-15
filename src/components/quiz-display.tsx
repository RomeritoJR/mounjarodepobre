'use client';

import { useState, useEffect } from 'react';
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
import { Slider } from './ui/slider';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

declare global {
  interface Window {
    _wq: any[];
    Wistia: any;
  }
}

type DetailedOption = { title: string; description: string; };
type Option = string | { text: string; image: string } | DetailedOption;

type QuizQuestion = Omit<GenerateMounjaroQuizOutput['quiz'][0], 'options'> & {
  description?: string;
  isIntroQuestion?: boolean;
  isInfoStep?: boolean;
  isBmiCalculator?: boolean;
  isBmiResult?: boolean;
  isFinalStep?: boolean;
  image?: string;
  infoTitle?: string;
  infoBody?: string;
  videoEmbed?: string;
  finalMessage?: string;
  buttonText?: string;
  carouselImages?: string[];
  options: Option[];
  layout?: 'default' | 'image-grid' | 'image-options' | 'detailed';
  headerText?: {
    timer: string;
    title: string;
    subtitle: string;
  };
  isOfferPage?: boolean;
};


type QuizDisplayProps = {
  quizData: QuizQuestion[];
};

export default function QuizDisplay({ quizData }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizData.length).fill(''));
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState('cm');
  const [videoEnded, setVideoEnded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (quizData[currentQuestionIndex]?.isFinalStep) {
      window._wq = window._wq || [];
      window._wq.push({
        id: "xl5k0fj643",
        onReady: (video: any) => {
          video.bind("end", () => {
            setVideoEnded(true);
          });
        }
      });
      const script = document.createElement('script');
      script.src = 'https://fast.wistia.net/assets/external/E-v1.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup Wistia video
        const wistiaVideo = window.Wistia?.video("xl5k0fj643");
        if (wistiaVideo) {
          wistiaVideo.remove();
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [currentQuestionIndex, quizData]);

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
      // Don't score the intro, info, or bmi questions
      if (question.isIntroQuestion || question.isInfoStep || question.isBmiCalculator || question.isBmiResult || question.isFinalStep) return count;
      return answers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    const totalScorableQuestions = quizData.filter(q => !q.isIntroQuestion && !q.isInfoStep && !q.isBmiCalculator && !q.isBmiResult && !q.isFinalStep).length;

    router.push(`/results?correct=${correctAnswersCount}&total=${totalScorableQuestions}`);
  };

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
  
  if (currentQuestion.isFinalStep) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            {currentQuestion.infoTitle && (
              <CardTitle className="text-2xl font-bold text-center text-green-600" dangerouslySetInnerHTML={{ __html: currentQuestion.infoTitle }} />
            )}
            {currentQuestion.infoBody && (
                <CardDescription className="text-center" dangerouslySetInnerHTML={{ __html: currentQuestion.infoBody }} />
            )}
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            {currentQuestion.videoEmbed && (
              <div dangerouslySetInnerHTML={{ __html: currentQuestion.videoEmbed }} />
            )}
            {currentQuestion.finalMessage && (
                <p className="text-center font-semibold mt-4" dangerouslySetInnerHTML={{ __html: currentQuestion.finalMessage}} />
            )}
          </CardContent>
          {videoEnded && (
             <CardFooter className="flex justify-center">
                <Button onClick={handleNext} size="lg" className="w-full text-xl h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg">
                    Avançar
                    <ArrowRight className="ml-2"/>
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    )
  }

  if (currentQuestion.isInfoStep) {
    return (
      <div className="w-full max-w-2xl space-y-4">
        {renderHeaderText()}
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
            <Button onClick={currentQuestionIndex < quizData.length - 1 ? handleNext : handleFinish} className={currentQuestion.isOfferPage ? "bg-red-600 hover:bg-red-700 w-full text-xl h-14" : ""}>
              {currentQuestion.buttonText || 'Continuar'}
              {currentQuestionIndex < quizData.length - 1 && !currentQuestion.isOfferPage ? <ArrowRight /> : <Check /> }
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (currentQuestion.isBmiResult) {
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    let bmiMessage = `Parabéns, você está na faixa de peso ideal! 🎉`;
    // You can add logic here to change the message based on the BMI value.
    
    return (
       <div className="w-full max-w-2xl space-y-4">
         <Card>
           <CardHeader>
              <CardTitle className="font-headline text-2xl text-center">{currentQuestion.question}</CardTitle>
           </CardHeader>
           <CardContent className="text-left space-y-4">
                <p>Seu IMC é: <strong className="text-primary">{bmi}</strong></p>
                <p>{bmiMessage}</p>
                <div className="text-sm space-y-2">
                    <p>Aqui estão alguns benefícios de se manter nesse intervalo de peso:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Menor risco de doenças crônicas como diabetes tipo 2, hipertensão e doenças cardíacas.</li>
                        <li>Melhor controle dos níveis de colesterol e da pressão arterial.</li>
                        <li>Maior qualidade de vida e uma expectativa de vida mais longa.</li>
                    </ul>
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                    <p>✨ Nosso protocolo alimentar vai te ajudar a manter a sua saúde em dia e ainda melhorar a sua estética corporal!</p>
                    <p>✔️ Com o Mounjaro de Pobre, o seu corpo acelera a queima de gordura de forma natural.</p>
                    <p>A combinação ideal de ingredientes pode ativar o seu metabolismo, reduzir a retenção de líquidos e aumentar a sua energia.</p>
                </div>
           </CardContent>
           <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
                    <ArrowLeft />
                    Anterior
                </Button>
                {currentQuestionIndex < quizData.length - 1 ? (
                    <Button onClick={handleNext}>
                    Próxima
                    <ArrowRight />
                    </Button>
                ) : (
                    <Button onClick={handleFinish} className="bg-red-600 hover:bg-red-700">
                    Finalizar
                    <Check />
                    </Button>
                )}
            </CardFooter>
         </Card>
       </div>
    );
  }

  if (currentQuestion.isBmiCalculator) {
    return (
       <div className="w-full max-w-2xl space-y-4">
        <Card>
           <CardHeader>
             <CardTitle className="font-headline text-2xl text-center">{currentQuestion.question}</CardTitle>
              {currentQuestion.description && (
               <CardDescription className="text-center">{currentQuestion.description}</CardDescription>
             )}
           </CardHeader>
           <CardContent className="space-y-6">
             <div className="space-y-4">
               <Label htmlFor="height">Qual é sua altura em cm?</Label>
                <div className="flex items-center gap-4">
                    <Tabs defaultValue="cm" onValueChange={setUnit} className="w-[100px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="cm">cm</TabsTrigger>
                            <TabsTrigger value="pol">pol</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <p className="text-2xl font-bold text-center bg-gray-100 p-2 rounded-md w-32">{height}{unit}</p>
                </div>
               <Slider
                 id="height"
                 min={140}
                 max={220}
                 step={1}
                 value={[height]}
                 onValueChange={(value) => setHeight(value[0])}
               />
               <p className="text-center text-sm text-muted-foreground">Arraste para ajustar</p>
             </div>
             
             {/* Simple weight slider for now */}
             <div className="space-y-4">
                <Label htmlFor="weight">Qual é o seu peso em kg?</Label>
                <p className="text-2xl font-bold text-center bg-gray-100 p-2 rounded-md w-32 mx-auto">{weight}kg</p>
                <Slider
                    id="weight"
                    min={40}
                    max={150}
                    step={1}
                    value={[weight]}
                    onValueChange={(value) => setWeight(value[0])}
                />
                 <p className="text-center text-sm text-muted-foreground">Arraste para ajustar</p>
             </div>

           </CardContent>
           <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
                    <ArrowLeft />
                    Anterior
                </Button>
                {currentQuestionIndex < quizData.length - 1 ? (
                    <Button onClick={handleNext}>
                    Próxima
                    <ArrowRight />
                    </Button>
                ) : (
                    <Button onClick={handleFinish} className="bg-red-600 hover:bg-red-700">
                    Finalizar
                    <Check />
                    </Button>
                )}
            </CardFooter>
        </Card>
       </div>
    );
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
