import { calculateQuizScoreAndAdvise } from '@/app/api/ai/calculate-quiz-score-and-advise';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResultsDisplay from '@/components/results-display';
import ResultsLoading from './loading';

export const metadata: Metadata = {
  title: 'Resultados - Mounjaro de Pobre Quiz',
};

type ResultsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  const correct = Number(searchParams.correct);
  const total = Number(searchParams.total);

  if (isNaN(correct) || isNaN(total) || total === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <CardTitle>Parâmetros Inválidos</CardTitle>
            <CardDescription>
              Os resultados não puderam ser calculados. Por favor, comece o quiz novamente.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Suspense fallback={<ResultsLoading />}>
        <ScoreInterpreter correct={correct} total={total} />
      </Suspense>
    </main>
  );
}

async function ScoreInterpreter({ correct, total }: { correct: number; total: number }) {
  try {
    const { score, advice } = await calculateQuizScoreAndAdvise({
      correctAnswers: correct,
      totalQuestions: total,
    });
    return <ResultsDisplay score={score} advice={advice} correct={correct} total={total} />;
  } catch (error) {
     // console.error(error); // This is commented out to avoid showing the Next.js error overlay.
     const score = (correct / total) * 100;
     let advice = "Não foi possível carregar o conselho personalizado, mas ótimo trabalho em completar o quiz! Continue aprendendo.";

     if (score >= 80) {
        advice = "Parabéns! Você tem um ótimo conhecimento sobre o assunto. Continue assim e explore dicas avançadas para otimizar ainda mais seus resultados.";
     } else if (score >= 50) {
        advice = "Você está no caminho certo! Continue estudando os materiais para aprimorar seus conhecimentos e melhorar seus resultados.";
     } else {
        advice = "Não desanime! Reveja os conceitos básicos e tente novamente. A jornada para uma vida mais saudável é um processo contínuo de aprendizado.";
     }
     
     return <ResultsDisplay score={score} advice={advice} correct={correct} total={total} />;
  }
}
