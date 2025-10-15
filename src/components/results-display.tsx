'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type ResultsDisplayProps = {
  score: number;
  advice: string;
  correct: number;
  total: number;
};

const chartConfig = {
  value: {
    label: 'Respostas',
  },
  correct: {
    label: 'Corretas',
    color: 'hsl(var(--primary))',
  },
  incorrect: {
    label: 'Incorretas',
    color: 'hsl(var(--muted))',
  },
};

export default function ResultsDisplay({ score, advice, correct, total }: ResultsDisplayProps) {
  const chartData = [
    { name: 'Corretas', value: correct, fill: 'var(--color-correct)' },
    { name: 'Incorretas', value: total - correct, fill: 'var(--color-incorrect)' },
  ];

  return (
    <Card className="w-full max-w-lg text-center shadow-lg">
      <CardHeader>
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <Award className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline mt-2">Quiz Finalizado!</CardTitle>
        <CardDescription>Veja seu desempenho abaixo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <p className="text-muted-foreground">Sua pontuação final</p>
          <p className="text-6xl font-bold text-primary">{score.toFixed(0)}%</p>
          <p className="font-medium">
            Você acertou {correct} de {total} perguntas.
          </p>
        </div>
        
        <div className="h-8 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0, right: 0, top:0, bottom: 0}}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" hide/>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" hideLabel />}
                        />
                        <Bar dataKey="value" layout="vertical" stackId="a" radius={5} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold font-headline text-lg">Conselho Personalizado</h3>
          <p className="text-muted-foreground mt-2 text-sm">{advice}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
          <Link href="/">Tentar Novamente</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
