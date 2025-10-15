import QuizDisplay from '@/components/quiz-display';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import QuizLoading from './loading';

export const metadata: Metadata = {
  title: 'Quiz - Mounjaro de Pobre',
};

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Suspense fallback={<QuizLoading />}>
        <QuizGenerator />
      </Suspense>
    </main>
  );
}

async function QuizGenerator() {
  const predefinedQuiz = {
    quiz: [
      {
        question: 'Quantos quilos você deseja perder?',
        description: 'O Protocolo Mounjaro dos Pobres te ajuda a eliminar gordura de forma acelerada.',
        options: ['Até 5 kg', 'De 6 a 10 kg', 'De 11 a 15 kg', 'De 16 a 20 kg', 'Mais de 20 kg'],
        correctAnswer: 'Mais de 20 kg', // Dummy correct answer, this question won't be scored
        isIntroQuestion: true,
      },
      {
        question: 'SELECIONA SUA IDADE PARA CONTINUAR👇',
        options: [
          { text: '18 - 29 anos', image: 'https://i.postimg.cc/s2ZJcfcP/Screenshot-20.png' },
          { text: '29 - 39 anos', image: 'https://i.postimg.cc/s2ZJcfcP/Screenshot-20.png' },
          { text: '39 - 49 anos', image: 'https://i.postimg.cc/L5yfSGDK/Screenshot-21.png' },
          { text: '+ 50 anos', image: 'https://i.postimg.cc/L5yfSGDK/Screenshot-21.png' },
        ],
        correctAnswer: '+ 50 anos', // Dummy
        isIntroQuestion: true,
        layout: 'image-grid',
        headerText: {
          timer: '🕒 Continua o diagnóstico GRATUITO em menos de 00:27',
          title: 'PLANO ÚNICO E FLEXÍVEL PARA PERDER de 5 a 10 KG EM 21 DIAS COM INGREDIENTES NATURAIS E UMA FRUTA PODEROSA',
          subtitle: 'Responda este questionário 🕒 rápido e receba seu plano perfeito mais a receita no final...',
        }
      },
      {
        question: 'Em que área do seu corpo você gostaria de reduzir mais gordura?',
        options: [
          'Região dos Culotes',
          'Região das Coxas',
          'Região do Abdomen',
          'Região dos Glúteos',
          'Região dos Braços',
          'Todo o Corpo',
        ],
        correctAnswer: 'Todo o Corpo', // Dummy
        isIntroQuestion: true,
      },
      {
        question: 'Realmente você está feliz com sua aparência?',
        description: 'Seja sincera...',
        options: [
            '😢 Não, porque me sinto com sobrepeso e isso abala minha autoestima',
            '💔 Sim, porém sei que posso melhorar minha saúde',
            '😞 Não, me olho no espelho e quase não me reconheço',
            '😭 Não, meu parceiro já não me olha mais com desejo como antes',
            '📸 Não, até evito tirar fotos porque sinto vergonha',
        ],
        correctAnswer: '😢 Não, because me sinto com sobrepeso e isso abala minha autoestima', // Dummy, won't be scored
        isIntroQuestion: true,
      },
      {
        question: 'E hoje, o que mais te impede de emagrecer?',
        options: [
          { title: '🕐 Falta de tempo', description: 'Rotina agitada. Não tenho muito tempo livre.' },
          { title: '🍫 Emocional e Autocontrole', description: 'Dificuldade para resistir às tentações alimentares. Compulsão alimentar, vício em doces, fast food.' },
          { title: '💸 Financeiro', description: 'Encontrar opções saudáveis mais caras do que os alimentos processados.' },
          { title: '😓 Constância', description: 'Não consigo ter motivação para seguir um plano por muito tempo.' },
        ],
        correctAnswer: '🕐 Falta de tempo', // Dummy
        isIntroQuestion: true,
        layout: 'detailed'
      },
      {
        isInfoStep: true,
        image: 'https://i.postimg.cc/XJjmDyzS/Screenshot-3.png',
        infoTitle: 'Você viu a pesquisa recente da Universidade de São Paulo informando a descoberta de um composto natural e uma fruta asiática que ATIVAM a produção dos hormônios do emagrecimento?',
        infoBody: 'Foi com base nela que desenvolvemos o <strong>Protocolo Truque do Mounjaro</strong>, veja abaixo👇<br /><br />É assim que 2.374 mulheres, neste protocolo, alcançaram resultados incríveis, reativando o metabolismo através de um método inovador que utiliza <strong>ESSA FRUTA ASIÁTICA E O SAL ROSA</strong>',
        buttonText: 'Continuar',
        question: '', // Needs to be here to avoid breaking type
        options: [], // Needs to be here to avoid breaking type
        correctAnswer: '', // Needs to be here to avoid breaking type
      },
      {
        question: 'Quais destes benefícios você gostaria de ter?',
        description: '👉 Vamos personalizar sua fórmula para maximizar seu resultado',
        options: [
            '🪞 Olhar no espelho e sentir bem comigo mesma, confiante',
            '⚡ Ter energia para viver o dia sem se arrastar',
            '👗 Poder colocar um vestido/blusa e não marcar a barriga',
            '🗣 Receber elogios das pessoas ao meu redor, perguntando o que fiz pra emagrecer',
            '🔥 Ver meu parceiro me olhando com desejo',
            '🦵 Poder fazer coisas simples como correr, agachar, viajar com conforto…',
        ],
        correctAnswer: '🪞 Olhar no espelho e sentir bem comigo mesma, confiante', // Dummy answer
        isIntroQuestion: true, // Treat as intro to not score
      },
      {
        isInfoStep: true,
        infoTitle: 'Vou te levar à sua melhor forma física!',
        infoBody: 'Vou transformar esse sonho em realidade, te dando todas as ferramentas que você precisa para emagrecer, exatamente como no caso dessas minhas alunas 👇',
        carouselImages: [
          'https://i.postimg.cc/9Mw8ktYD/Screenshot-5.png',
          'https://i.postimg.cc/hjQyYb17/Screenshot-6.png',
          'https://i.postimg.cc/nz9RWYG9/Screenshot-7.png',
          'https://i.postimg.cc/63FqhwYF/Screenshot-4.png',
          'https://i.postimg.cc/529PJMmL/Screenshot-2.png',
        ],
        buttonText: 'Continuar',
        question: '',
        options: [],
        correctAnswer: '',
      },
      {
        isBmiCalculator: true,
        question: 'Calculando seu IMC',
        description: 'O IMC (índice de massa corporal) é um indicador para saber se uma pessoa tem um peso saudável em relação à sua altura.',
        options: [],
        correctAnswer: '',
      },
       {
        isBmiResult: true,
        question: 'Aqui está seu perfil',
        options: [],
        correctAnswer: '',
      },
      {
        isInfoStep: true,
        headerText: {
          timer: 'Agora falta pouco para ter acesso ao Mounjaro: 00:00',
          title: 'O Antes e Depois das minhas alunas',
          subtitle: 'Testado e aprovado por centenas de mulheres que se conectam entre si DIARIAMENTE NO GRUPO...',
        },
        carouselImages: [
          'https://i.postimg.cc/nz9RWYG9/Screenshot-7.png',
          'https://i.postimg.cc/cL6JPrPG/Screenshot-18.png',
          'https://i.postimg.cc/RZsz5dKX/Screenshot-14.png',
          'https://i.postimg.cc/VkGcQgnH/Screenshot-15.png',
          'https://i.postimg.cc/htyqWsTZ/Screenshot-25.png',
          'https://i.postimg.cc/Z57htHp7/Screenshot-26.png',
          'https://i.postimg.cc/BnYG9pHR/Screenshot-27.png',
        ],
        buttonText: 'Continuar',
        question: '',
        options: [],
        correctAnswer: '',
      },
       {
        isFinalStep: true,
        infoTitle: 'Parabéns! Seu Protocolo Personalizado de emagrecimento com o Mounjaro de Pobre está pronto!',
        infoBody: 'Assista o breve video abaixo para liberar SEU protocolo e entender como funciona👇',
        videoEmbed: '<div class="wistia_responsive_padding" style="padding:178.33% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="https://fast.wistia.net/embed/iframe/xl5k0fj643?web_component=true&seo=true" title="vsl Video" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="100%" height="100%"></iframe></div></div>',
        finalMessage: 'Esse protocolo é exclusivo SEU e gerado apenas uma vez, então por favor <strong>NÃO saia da página para não perdê-lo</strong>',
        buttonText: "Avançar",
        question: '',
        options: [],
        correctAnswer: '',
      },
      {
        isOfferPage: true,
        question: '',
        options: [],
        correctAnswer: '',
      },
    ],
  };

  try {
    // We are using a predefined quiz, so no need to call the AI.
    const { quiz } = predefinedQuiz;
    
    if (!quiz || quiz.length === 0) {
      throw new Error('Failed to load predefined quiz questions.');
    }

    return <QuizDisplay quizData={quiz} />;
  } catch (error) {
    // console.error(error); - Removed to prevent Next.js error overlay
    return (
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle>Erro ao Gerar o Quiz</CardTitle>
          <CardDescription>
            Não foi possível carregar as perguntas. Por favor, tente novamente mais tarde.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
            <Button asChild>
                <Link href="/">Voltar ao Início</Link>
            </Button>
        </CardFooter>
      </Card>
    );
  }
}

    