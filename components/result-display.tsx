"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, Calculator } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultDisplayProps {
  result: {
    determinant: number;
    steps: string[];
  } | null;
  method: "sarrus" | "laplace" | "chio";
}

export default function ResultDisplay({ result, method }: ResultDisplayProps) {
  const methodNames = {
    sarrus: "Sarrus",
    laplace: "Laplace",
    chio: "Chiò",
  };

  if (!result) {
    return (
      <Card className="flex items-center justify-center p-12">
        <div className="text-center">
          <Calculator className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold text-muted-foreground">
            Aguardando cálculo
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha a matriz e clique em calcular
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">
          Resultado - Método de {methodNames[method]}
        </h2>
      </div>

      <div className="mb-6 rounded-lg bg-primary/10 p-6 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Determinante
        </p>
        <p className="text-5xl font-bold text-primary">
          {Number.isInteger(result.determinant)
            ? result.determinant
            : parseFloat(result.determinant.toFixed(4))}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Passos do Cálculo:</h3>
        <ScrollArea className="h-[500px] rounded-lg border bg-muted/30 p-4">
          <pre className="font-mono text-sm leading-relaxed text-foreground">
            {result.steps.join("\n")}
          </pre>
        </ScrollArea>
      </div>
    </Card>
  );
}
