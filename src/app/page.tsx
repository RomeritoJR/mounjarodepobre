import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
            <Image 
                src="https://i.postimg.cc/3xYYXWFJ/Screenshot-1.png" 
                alt="Especialista em saúde"
                width={500}
                height={100}
                className="rounded-lg"
            />
        </div>

        <div className="bg-lime-100 text-green-800 p-4 rounded-lg text-center mb-6 shadow">
            <p className="text-lg">
                Você está a <strong>2 minutos</strong> de descobrir por que o seu corpo se recusa a emagrecer e como usar o <strong className="font-bold">Mounjaro de Pobre</strong> que queima gordura 24 horas por dia <strong className="font-bold">(sem academia e sem dietas malucas)</strong>.
            </p>
        </div>

        <Button asChild size="lg" className="w-full text-xl h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg">
            <Link href="/quiz">Pegar Minha Receita</Link>
        </Button>

        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                <strong className="text-red-600 font-bold">Atenção:</strong> oferecemos apenas <strong>uma consulta por pessoa</strong>.
            </p>
            <p className="text-xs text-gray-500 mt-1">Se você sair, perderá a sua vez.</p>
        </div>
      </div>
    </main>
  );
}
