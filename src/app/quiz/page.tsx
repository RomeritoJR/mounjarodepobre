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
        question: 'O que é o "Mounjaro de Pobre"?',
        options: ['Um remédio caro', 'Uma bebida natural para auxiliar no emagrecimento', 'Um tipo de exercício físico', 'Uma dieta da moda'],
        correctAnswer: 'Uma bebida natural para auxiliar no emagrecimento',
      },
      {
        question: 'Qual destes NÃO é um benefício associado à bebida?',
        options: ['Acelerar o metabolismo', 'Aumentar a massa muscular instantaneamente', 'Reduzir o inchaço', 'Promover a saciedade'],
        correctAnswer: 'Aumentar a massa muscular instantaneamente',
      },
      {
        question: 'Qual a importância da água na perda de peso?',
        options: ['Não tem importância', 'Ajuda a hidratar e a eliminar toxinas', 'Engorda', 'Só pode ser bebida gelada'],
        correctAnswer: 'Ajuda a hidratar e a eliminar toxinas',
      },
      {
        question: 'O que são calorias vazias?',
        options: ['Alimentos sem calorias', 'Alimentos que não engordam', 'Alimentos com muitas calorias e poucos nutrientes', 'Alimentos saudáveis'],
        correctAnswer: 'Alimentos com muitas calorias e poucos nutrientes',
      },
      {
        question: 'Qual destes é um pilar para o emagrecimento saudável e sustentável?',
        options: ['Fazer dietas extremamente restritivas', 'Apenas tomar a bebida', 'Equilíbrio entre alimentação, exercício e descanso', 'Pular o café da manhã'],
        correctAnswer: 'Equilíbrio entre alimentação, exercício e descanso',
      },
      {
        question: 'Por que o sono é importante para quem quer emagrecer?',
        options: ['Porque durante o sono não comemos', 'Ajuda na regulação de hormônios como cortisol e grelina', 'Não afeta o emagrecimento', 'Aumenta o estresse'],
        correctAnswer: 'Ajuda na regulação de hormônios como cortisol e grelina',
      },
      {
        question: 'Qual o papel das fibras na alimentação?',
        options: ['Aumentar o apetite', 'Engordar rapidamente', 'Ajudar na digestão e promover saciedade', 'Não possuem função'],
        correctAnswer: 'Ajudar na digestão e promover saciedade',
      },
      {
        question: 'O que significa "déficit calórico"?',
        options: ['Consumir mais calorias do que gasta', 'Não contar calorias', 'Consumir menos calorias do que o corpo gasta', 'Consumir apenas calorias de proteínas'],
        correctAnswer: 'Consumir menos calorias do que o corpo gasta',
      },
      {
        question: 'Beber o "Mounjaro de Pobre" substitui a necessidade de exercícios físicos?',
        options: ['Sim, completamente', 'Não, é um auxiliar e deve ser combinado com hábitos saudáveis', 'Sim, mas só por uma semana', 'Depende do seu peso'],
        correctAnswer: 'Não, é um auxiliar e deve ser combinado com hábitos saudáveis',
      },
      {
        question: 'Qual é o maior erro que as pessoas cometem ao tentar emagrecer?',
        options: ['Beber muita água', 'Procurar soluções rápidas e milagrosas sem mudar o estilo de vida', 'Comer frutas', 'Dormir 8 horas por noite'],
        correctAnswer: 'Procurar soluções rápidas e milagrosas sem mudar o estilo de vida',
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
