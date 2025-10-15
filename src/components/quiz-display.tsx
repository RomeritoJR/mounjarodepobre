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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

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
      // Don't score the intro, info, or bmi questions
      if (question.isIntroQuestion || question.isInfoStep || question.isBmiCalculator || question.isBmiResult || question.isFinalStep || question.isOfferPage) return count;
      return answers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    const totalScorableQuestions = quizData.filter(q => !q.isIntroQuestion && !q.isInfoStep && !q.isBmiCalculator && !q.isBmiResult && !q.isFinalStep && !q.isOfferPage).length;

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

  if (currentQuestion.isOfferPage) {
    const bonusItems = [
      {
        image: "https://media.inlead.cloud/uploads/34056/2025-09-09/md-huqJP-chatgpt-image-9-de-set-de-2025-11-46-50.png",
        title: "Potencializa a queima de gordura",
        description: "Saiba exatamente o que comer durante o protocolo e depois dele."
      },
      {
        image: "https://media.inlead.cloud/uploads/34056/2025-09-09/md-dYCvX-design-sem-nome-42.png",
        title: "Protocolo Anti-Inchaço",
        description: "Aprenda a maneira mais fácil de desinflamar e ver grandes resultados em menos de 7 dias com um protocolo simples e natural que reduz a inflamação e elimina o inchaço."
      },
      {
        image: "https://media.inlead.cloud/uploads/34056/2025-09-09/md-7Cokv-chatgpt-image-9-de-set-de-2025-13-01-15.png",
        title: "Anti-Efeito Sanfona",
        description: "Chega de perder peso e recuperar tudo de novo! Esse protocolo foi desenvolvido para garantir resultados duradouros, combatendo o efeito sanfona de forma simples e natural"
      },
      {
        image: "https://media.inlead.cloud/uploads/34056/2025-09-09/md-1Ma3w-chatgpt-image-9-de-set-de-2025-11-39-09.png",
        title: "Zero Celulite",
        description: "Chega de perder peso e recuperar tudo de novo! Esse protocolo foi desenvolvido para garantir resultados duradouros, combatendo o efeito sanfona de forma simples e natural"
      },
      {
        image: "https://media.inlead.cloud/uploads/34056/2025-08-09/md-dhlBW-telegram-logo-5.png",
        title: "Desafio de 21 dias",
        description: "Desafio para maximizar ainda mais teus resultados"
      },
      {
        image: "https://media.inlead.cloud/uploads/34056/2025-08-09/md-Hren8-telegram-logo-6.png",
        title: "Suporte",
        description: "Soporte durante todo seu proceso para o que necesitar"
      },
    ];
    const testimonials = [
      'https://i.postimg.cc/cL6JPrPG/Screenshot-18.png',
      'https://i.postimg.cc/VkGcQgnH/Screenshot-15.png',
      'https://i.postimg.cc/RZsz5dKX/Screenshot-14.png',
      'https://i.postimg.cc/htyqWsTZ/Screenshot-25.png',
      'https://i.postimg.cc/BnYG9pHR/Screenshot-27.png',
    ];
    const studentComments = [
      {
        name: "Ana Rodríguez",
        handle: "@ana.rodriguez",
        comment: "Muito bom! Eu recomendo, meu apetite diminuiu bastante e já perdi 5 kg nos últimos 11 dias.",
        image: "" // Add image url
      },
      {
        name: "Camila Ferreira",
        handle: "@camila.ferreira",
        comment: "Recomendo demais! Estou usando há 2 semanas e tenho muito menos vontade de comer besteiras, já emagreci e desinchei bastante. Obrigada!! 🥰🥰",
        image: ""
      },
      {
        name: "Lucía Martínez",
        handle: "@martinez.lucia256",
        comment: "Oii, comprei hoje porque uma amiga me recomendou… Tenho uma dúvida: posso tomar mais de uma vez ao dia se eu quiser? 😅",
        image: ""
      },
      {
        name: "Sofía López",
        handle: "@sofialopes.2025",
        comment: "Muito bom! Deu pra conciliar fácil com as atividades diárias, só quem é mãe, sabe como é dificil mas eu achei barato e emagrece bastante!",
        image: ""
      }
    ];

    const faqItems = [
      {
        question: "Tem Garantia?",
        answer: "➡️ Todo produto digital é obrigado por lei a oferecer um mínimo de 7 dias de garantia, no entanto, nós oferecemos 30 dias. Código de Defesa do Consumidor (CDC) artigo 49."
      },
      { question: "Estou amamentando, posso tomar?", answer: "Sim, pode! Nosso protocolo é 100% natural e não interfere na amamentação." },
      { question: "Sou hipertenso, posso tomar?", answer: "Sim, pode! O protocolo não tem contra-indicações para hipertensos." },
      { question: "Em quanto tempo verei resultados?", answer: "Muitas alunas relatam resultados visíveis na primeira semana, mas os resultados podem variar de pessoa para pessoa." },
      { question: "Preciso fazer dieta ou exercícios?", answer: "Não é obrigatório. O protocolo é desenhado para funcionar por si só, mas uma alimentação saudável e exercícios podem potencializar os resultados." },
      { question: "Funciona para mulheres com mais de 30 anos?", answer: "Sim! O protocolo é eficaz para mulheres de todas as idades." },
      { question: "Tem algum efeito colateral?", answer: "Não, por ser um protocolo 100% natural, não há efeitos colaterais." },
      { question: "Como recebo o protocolo?", answer: "O acesso é imediato após a confirmação do pagamento. Você receberá tudo por e-mail." },
      { question: "Existe suporte?", answer: "Sim, oferecemos suporte completo para tirar todas as suas dúvidas." }
    ]


    return (
      <div className="w-full max-w-4xl space-y-8 bg-white p-4 sm:p-8 rounded-lg">
        <section className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Como funciona o Mounjaro de Pobre?</h1>
          <p className="text-muted-foreground">Com base nas suas informações pessoais e nos seus objetivos, criamos um protocolo 100% personalizado para que você utilize o Mounjaro da melhor forma.</p>
          <p>Nosso enfoque estratégico foi desenvolvido para te ajudar a potencializar a perda de peso em apenas 3 semanas, com a quantidade exata da medida de ingredientes de cada receita, respeitando o seu estilo de vida, a sua rotina e as suas preferências alimentares.</p>
          <p>Ao contrário das dietas comuns, que funcionam como remendos temporários — perdem o efeito assim que você as abandona — o Mounjaro de Pobre é como um reinício completo do sistema: reprograma o seu metabolismo de forma permanente.</p>
          <p className="font-bold">Sabe por quê? Porque nós não tratamos apenas os sintomas — transformamos a raiz do problema.</p>
          <p>Enquanto outros métodos se concentram apenas em reduzir calorias (o que inevitavelmente falha a longo prazo), o nosso protocolo reativa as suas enzimas, transformando o seu corpo em uma máquina de queimar gordura 24 horas por dia, até mesmo enquanto você dorme.</p>
        </section>

        <section className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="font-bold text-lg">Acesso imediato ao nosso APP 📱</p>
            </div>
             <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="font-bold text-lg">Grupo VIP Secando em Casa 👇</p>
            </div>
            <Carousel className="w-full max-w-sm mx-auto" opts={{ loop: true }}>
                <CarouselContent>
                    <CarouselItem><Image src="https://i.postimg.cc/BnYG9pHR/Screenshot-27.png" alt="Depoimento 1" width={400} height={400} className="rounded-lg object-contain" /></CarouselItem>
                    <CarouselItem><Image src="https://i.postimg.cc/htyqWsTZ/Screenshot-25.png" alt="Depoimento 2" width={400} height={400} className="rounded-lg object-contain" /></CarouselItem>
                    <CarouselItem><Image src="https://i.postimg.cc/Z57htHp7/Screenshot-26.png" alt="Depoimento 3" width={400} height={400} className="rounded-lg object-contain" /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>

        <section className="text-center space-y-6">
          <h2 className="text-2xl font-bold">BÔNUS QUE VOCÊ GANHA HOJE AINDA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bonusItems.map((item, index) => (
              <Card key={index} className="text-left">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <Image src={item.image} alt={item.title} width={150} height={150} className="rounded-md object-cover mb-4" />
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
            <Image src="https://media.inlead.cloud/uploads/34056/2025-09-24/lg-QRPE7-preco-low-ticket-talla-38-13.png" alt="Preço" width={800} height={400} className="mx-auto rounded-lg"/>
            <Image src="https://media.inlead.cloud/uploads/34056/2025-08-13/md-fpRm3-depoimentos-talla-38-331-x-73-px-221-x-63-px-221-x-63-px-2.png" alt="Depoimentos" width={800} height={100} className="mx-auto rounded-lg"/>
            
            <div className="bg-gray-100 p-6 rounded-lg text-left text-sm space-y-2">
                <h3 className="text-lg font-bold mb-4 text-center">📊 Compare os Custos para Emagrecer:</h3>
                <p>• Ozempic (1 mês): <span className="font-bold float-right">R$ 3.000</span></p>
                <p>• Nutricionista particular: <span className="font-bold float-right">R$ 500/consulta</span></p>
                <p>• Academia + Pessoal: <span className="font-bold float-right">R$ 600/mês</span></p>
                <p>• Cirurgia bariátrica: <span className="font-bold float-right">R$ 20.000-50.000</span></p>
                <p className="text-primary font-bold text-base mt-2">• Mounjaro de Pobre (COMPLETO): <span className="float-right">R$ 37,00</span></p>
            </div>
            
            <Button size="lg" className="w-full text-xl h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg">QUERO COMEÇAR HOJE!</Button>
            <p className="text-center text-xs text-gray-500">✅ Pagamento único • Sem mensalidades • Garantia de 30 dias</p>
            <p className="text-center text-xs text-red-600 font-bold">✅ Se você não perder pelo menos 5 kg, devolvemos 100% do seu dinheiro</p>
            <p className="text-center text-sm text-gray-600">Resgate AGORA seu desconto: <span className="font-bold">00:00</span></p>
        </section>

        <section className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">ANTES E DEPOIS 👇</h2>
            <Carousel className="w-full max-w-sm mx-auto" opts={{ loop: true }}>
                <CarouselContent>
                    {testimonials.map((src, index) => (
                        <CarouselItem key={index}><Image src={src} alt={`Testimonial ${index+1}`} width={400} height={400} className="rounded-lg object-contain" /></CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <p className="text-muted-foreground">Deslize para o lado ➡️</p>
        </section>
        
        <section className="space-y-4">
            <Image src="https://media.inlead.cloud/uploads/34056/2025-10-14/lg-wnXY1-antes.png" alt="História da Lucy" width={800} height={400} className="mx-auto rounded-lg"/>
            <p className="text-center">A história da Lucy pode te inspirar! ❤ Ela eliminou 18 quilos, melhorou o colesterol, controlou o açúcar no sangue, rejuvenesceu e, o mais importante, recuperou a autoestima. 💪</p>
            <p className="text-center">Hoje, ela se sente tão bem com os resultados que indica o nosso protocolo para todo mundo.</p>
            <p className="text-center">E nós temos muito orgulho de ter acompanhado essa jornada de perto. 🙏</p>
            <p className="text-center font-bold">Talvez o que está faltando para você começar é saber que é possível.</p>
            <p className="text-center">E sim, com o acompanhamento certo, você também pode emagrecer e se sentir saudável</p>
            <Button size="lg" className="w-full text-xl h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg">QUERO COMEÇAR!</Button>
            <Image src="https://media.inlead.cloud/uploads/34056/2025-08-13/md-fpRm3-depoimentos-talla-38-331-x-73-px-221-x-63-px-221-x-63-px-2.png" alt="Depoimentos" width={800} height={100} className="mx-auto rounded-lg"/>
        </section>
        
        <section className="space-y-4 text-center">
             <Image src="https://media.inlead.cloud/uploads/34056/2025-08-25/lg-YaeQv-garantia-de-30-dias-1.jpg" alt="Garantia 30 dias" width={300} height={300} className="mx-auto rounded-full"/>
             <p className="font-bold text-lg">👮 Todo produto é OBRIGADO por lei a emitir garantia!</p>
             <p>Como confiamos na fórmula, oferecemos 30 dias corridos</p>
             <p>Ou seja, se ela não atender às suas expectativas no primeiro mês de uso ou se você não conseguir perder nem um único quilo, nós reembolsaremos cada centavo que você pagou, sem perguntas.</p>
             <p className="text-center text-sm text-gray-600">Resgate AGORA seu desconto: <span className="font-bold">00:00</span></p>
        </section>
        
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-center">⭐ O que nossas alunas estão dizendo</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentComments.map((comment, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex gap-4 items-start">
                            {/* <Image src={comment.image} alt={comment.name} width={48} height={48} className="rounded-full" /> */}
                            <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0"></div>
                            <div>
                                <p className="font-bold">{comment.name}</p>
                                <p className="text-sm text-muted-foreground">{comment.handle}</p>
                                <p className="mt-2 text-sm">{comment.comment}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
        </section>

        <section className="space-y-4 text-center bg-yellow-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold">🔥 OFERTA ESPECIAL - APENAS HOJE!</h2>
            <p className="font-bold">Mounjaro de Pobre + Bônus</p>
            <p className="line-through text-muted-foreground">DE R$197 POR APENAS</p>
            <div className="bg-red-500 text-white font-bold py-1 px-3 rounded-full inline-block">90% off</div>
            <p className="text-5xl font-bold text-primary">R$37,00</p>
            <p className="text-sm">à vista</p>
            <Button size="lg" className="w-full text-xl h-14 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg">💰 GARANTIR MINHA VAGA POR R$37</Button>
            <p className="text-xs text-gray-500">Pagamento único • Sem mensalidades • Garantia de 30 dias</p>
            <p className="font-bold mt-4">Se você não emagrecer pelo menos 5kg em 30 dias...</p>
            <p className="font-bold">Eu vou te devolver cada centavo que você pagou, sem fazer perguntas!</p>
            <p className="font-bold">É 100% sem risco para você! 💯</p>
        </section>

        <section>
            <Image src="https://media.inlead.cloud/uploads/34056/2025-08-13/lg-uWUrI-se-voce-tambem-quer-sentir-essa-mudanca-esta-na.jpg" alt="Final call" width={800} height={400} className="mx-auto rounded-lg"/>
        </section>
        
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-center">PERGUNTAS FREQUENTES</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </section>

      </div>
    );
  }
  
  if (currentQuestion.isFinalStep) {
    const videoEmbedHtml = currentQuestion.videoEmbed;
      
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
            {videoEmbedHtml && (
              <div dangerouslySetInnerHTML={{ __html: videoEmbedHtml }} />
            )}
            {currentQuestion.finalMessage && (
                <p className="text-center font-semibold mt-4" dangerouslySetInnerHTML={{ __html: currentQuestion.finalMessage}} />
            )}
          </CardContent>
           {currentQuestion.buttonText && (
            <CardFooter className="flex justify-center">
                <Button onClick={handleNext} size="lg" className="w-full text-xl h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg">
                    {currentQuestion.buttonText}
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
              {currentQuestionIndex < quizData.length - 1 ? <ArrowRight className="ml-2"/> : <Check /> }
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
              <CardTitle className="font-headline text-2xl text-center">Aqui está seu perfil</CardTitle>
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
