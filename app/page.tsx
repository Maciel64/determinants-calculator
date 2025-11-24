"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Minus, Shuffle } from "lucide-react";
import MatrixInput from "@/components/matrix-input";
import ResultDisplay from "@/components/result-display";
import { calculateDeterminant } from "@/helpers/methods";

export default function DeterminantCalculator() {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState<(number | null)[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  );
  const [method, setMethod] = useState<"sarrus" | "laplace" | "chio">("sarrus");
  const [result, setResult] = useState<{
    determinant: number;
    steps: string[];
  } | null>(null);

  const handleMatrixSizeChange = (newSize: number) => {
    const size = Math.max(2, Math.min(6, newSize));
    setMatrixSize(size);
    setMatrix(
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(null))
    );
    setResult(null);
  };

  const fillRandomValues = () => {
    const randomMatrix = Array(matrixSize)
      .fill(null)
      .map(() =>
        Array(matrixSize)
          .fill(null)
          .map(() => Math.floor(Math.random() * 20) - 10)
      );
    setMatrix(randomMatrix);
    setResult(null);
  };

  const handleCalculate = () => {
    const numericMatrix = matrix.map((row) => row.map((val) => val ?? 0));
    const det = calculateDeterminant(numericMatrix, method);
    setResult(det);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Calculadora de Determinantes
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Calcule determinantes usando os métodos de Sarrus, Laplace e Chiò
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block text-base font-semibold">
                  Tamanho da Matriz
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMatrixSizeChange(matrixSize - 1)}
                    disabled={matrixSize <= 2}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[80px] text-center text-2xl font-bold">
                    {matrixSize}×{matrixSize}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMatrixSizeChange(matrixSize + 1)}
                    disabled={matrixSize >= 6}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-base font-semibold">
                  Método de Cálculo
                </Label>
                <div className="grid gap-2">
                  <Button
                    variant={method === "sarrus" ? "default" : "outline"}
                    onClick={() => setMethod("sarrus")}
                    className="justify-start"
                    disabled={matrixSize !== 3 && matrixSize !== 2}
                  >
                    Sarrus{" "}
                    {matrixSize !== 3 &&
                      matrixSize !== 2 &&
                      "(apenas 2×2 e 3×3)"}
                  </Button>
                  <Button
                    variant={method === "laplace" ? "default" : "outline"}
                    onClick={() => setMethod("laplace")}
                    className="justify-start"
                  >
                    Laplace (Cofatores)
                  </Button>
                  {/* <Button
                    variant={method === "chio" ? "default" : "outline"}
                    onClick={() => setMethod("chio")}
                    className="justify-start"
                    disabled={matrixSize < 3}
                  >
                    Chiò {matrixSize < 3 && "(mínimo 3×3)"}
                  </Button> */}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Insira os valores da matriz
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fillRandomValues}
                    className="gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    Aleatório
                  </Button>
                </div>
                <MatrixInput matrix={matrix} onChange={setMatrix} />
              </div>

              <Button onClick={handleCalculate} className="w-full" size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                Calcular Determinante
              </Button>
            </div>
          </Card>

          <ResultDisplay result={result} method={method} />
        </div>
      </div>
    </main>
  );
}
