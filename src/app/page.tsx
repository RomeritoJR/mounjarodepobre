import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassWater } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mb-4">
        <Image
          src="https://i.postimg.cc/3xYYXWFJ/Screenshot-1.png"
          alt="Mounjaro de Pobre"
          width={640}
          height={335}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full w-fit">
            <GlassWater className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">Mounjaro de Pobre Quiz</CardTitle>
          <CardDescription>Teste seus conhecimentos sobre esta bebida saudável!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
          Você está a 2 minutos de descobrir por que o seu corpo se recusa a emagrecer e como usar o Mounjaro de Pobre que queima gordura 24 horas por dia (sem academia e sem dietas malucas).
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Link href="/quiz">Começar o Quiz</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
