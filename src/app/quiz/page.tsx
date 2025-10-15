import { generateMounjaroQuiz } from '@/app/api/ai/generate-mounjaro-quiz';
import QuizDisplay from '@/components/quiz-display';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import QuizLoading from './loading';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Quiz - Mounjaro de Pobre',
};

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
       <div className="w-full max-w-2xl mx-auto mb-4">
        <Image
          src="https://i.postimg.cc/3xYYXWFJ/Screenshot-1.png"
          alt="Mounjaro dos Pobres Logo"
          width={200}
          height={50}
          className="mx-auto"
        />
      </div>
      <Suspense fallback={<QuizLoading />}>
        <QuizGenerator />
      </Suspense>
    </main>
  );
}

async function QuizGenerator() {
  try {
    const { quiz } = await generateMounjaroQuiz({
      topic: 'Emagrecimento e perda de peso',
      numberOfQuestions: 10,
    });
    
    if (!quiz || quiz.length === 0) {
      throw new Error('Failed to generate quiz questions.');
    }

    return <QuizDisplay quizData={quiz} />;
  } catch (error) {
    // console.error(error); // This was causing an error in Next.js
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
