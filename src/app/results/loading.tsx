import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResultsLoading() {
  return (
    <Card className="w-full max-w-lg text-center">
      <CardHeader>
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto mt-4" />
        <Skeleton className="h-5 w-3/4 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-6 w-1/3 mx-auto" />
            <Skeleton className="h-16 w-1/2 mx-auto" />
            <Skeleton className="h-5 w-2/5 mx-auto" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
            <Skeleton className="h-6 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Skeleton className="h-12 w-40" />
      </CardFooter>
    </Card>
  );
}
