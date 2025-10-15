import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuizLoading() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground font-medium">
          Carregando...
        </p>
        <Progress value={0} className="w-full" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    </div>
  );
}
