"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Minus, Shuffle } from "lucide-react";
import MatrixInput from "@/components/matrix-input";
import ResultDisplay from "@/components/result-display";

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

  const calculateDeterminant = (
    mat: number[][],
    calculationMethod: "sarrus" | "laplace" | "chio"
  ) => {
    switch (calculationMethod) {
      case "sarrus":
        return sarrusMethod(mat);
      case "laplace":
        return laplaceMethod(mat);
      case "chio":
        return chioMethod(mat);
      default:
        return { determinant: 0, steps: [] };
    }
  };

  const sarrusMethod = (mat: number[][]) => {
    const steps: string[] = [];
    const n = mat.length;

    if (n === 2) {
      steps.push("📐 MÉTODO DE SARRUS (Matriz 2x2)");
      steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      steps.push("");

      steps.push("Matriz original:");
      mat.forEach((row) => {
        steps.push(
          `[ ${row.map((val) => val.toString().padStart(5)).join("  ")} ]`
        );
      });
      steps.push("");

      steps.push("Para matriz 2×2, o determinante é calculado como:");
      steps.push("det(A) = a₁₁ × a₂₂ - a₁₂ × a₂₁");
      steps.push("");

      const d1 = mat[0][0] * mat[1][1];
      const d2 = mat[0][1] * mat[1][0];

      steps.push(`Diagonal principal: ${mat[0][0]} × ${mat[1][1]} = ${d1}`);
      steps.push(`Diagonal secundária: ${mat[0][1]} × ${mat[1][0]} = ${d2}`);
      steps.push("");

      const determinant = d1 - d2;
      steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      steps.push(`✅ DETERMINANTE = ${d1} - ${d2} = ${determinant}`);

      return { determinant, steps };
    }

    if (n !== 3) {
      return {
        determinant: 0,
        steps: [
          "❌ O método de Sarrus funciona apenas para matrizes 2x2 e 3x3",
        ],
      };
    }

    steps.push("📐 MÉTODO DE SARRUS (Matriz 3x3)");
    steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    steps.push("");

    // Display matrix
    steps.push("Matriz original:");
    mat.forEach((row, i) => {
      steps.push(
        `[ ${row.map((val) => val.toString().padStart(5)).join("  ")} ]`
      );
    });
    steps.push("");

    // Extend matrix
    steps.push("Extensão da matriz (adicionar primeiras 2 colunas):");
    const extended = mat.map((row, i) => [...row, mat[i][0], mat[i][1]]);
    extended.forEach((row) => {
      steps.push(
        `[ ${row.map((val) => val.toString().padStart(5)).join("  ")} ]`
      );
    });
    steps.push("");

    // Main diagonal
    steps.push("➡️  DIAGONAIS PRINCIPAIS (esquerda → direita):");
    const d1 = mat[0][0] * mat[1][1] * mat[2][2];
    const d2 = mat[0][1] * mat[1][2] * mat[2][0];
    const d3 = mat[0][2] * mat[1][0] * mat[2][1];

    steps.push(`D1 = ${mat[0][0]} × ${mat[1][1]} × ${mat[2][2]} = ${d1}`);
    steps.push(`D2 = ${mat[0][1]} × ${mat[1][2]} × ${mat[2][0]} = ${d2}`);
    steps.push(`D3 = ${mat[0][2]} × ${mat[1][0]} × ${mat[2][1]} = ${d3}`);
    steps.push(`Soma das principais = ${d1} + ${d2} + ${d3} = ${d1 + d2 + d3}`);
    steps.push("");

    // Secondary diagonal
    steps.push("⬅️  DIAGONAIS SECUNDÁRIAS (direita → esquerda):");
    const s1 = mat[0][2] * mat[1][1] * mat[2][0];
    const s2 = mat[0][0] * mat[1][2] * mat[2][1];
    const s3 = mat[0][1] * mat[1][0] * mat[2][2];

    steps.push(`S1 = ${mat[0][2]} × ${mat[1][1]} × ${mat[2][0]} = ${s1}`);
    steps.push(`S2 = ${mat[0][0]} × ${mat[1][2]} × ${mat[2][1]} = ${s2}`);
    steps.push(`S3 = ${mat[0][1]} × ${mat[1][0]} × ${mat[2][2]} = ${s3}`);
    steps.push(
      `Soma das secundárias = ${s1} + ${s2} + ${s3} = ${s1 + s2 + s3}`
    );
    steps.push("");

    const determinant = d1 + d2 + d3 - (s1 + s2 + s3);
    steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    steps.push(
      `✅ DETERMINANTE = (${d1 + d2 + d3}) - (${s1 + s2 + s3}) = ${determinant}`
    );

    return { determinant, steps };
  };

  const laplaceMethod = (mat: number[][]) => {
    const steps: string[] = [];

    steps.push("📐 MÉTODO DE LAPLACE (Expansão por Cofatores)");
    steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    steps.push("");

    const calculateDet = (m: number[][], depth: number = 0): number => {
      const n = m.length;
      const indent = "  ".repeat(depth);

      if (n === 1) {
        return m[0][0];
      }

      if (n === 2) {
        const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
        if (depth > 0) {
          steps.push(
            `${indent}|${m[0][0]} ${m[0][1]}| = ${m[0][0]}×${m[1][1]} - ${m[0][1]}×${m[1][0]} = ${det}`
          );
          steps.push(`${indent}|${m[1][0]} ${m[1][1]}|`);
        }
        return det;
      }

      if (depth === 0) {
        steps.push("Matriz original:");
        m.forEach((row) => {
          steps.push(
            `[ ${row.map((val) => val.toString().padStart(5)).join("  ")} ]`
          );
        });
        steps.push("");
        steps.push("Expandindo pela primeira linha:");
        steps.push("");
      }

      let det = 0;
      for (let j = 0; j < n; j++) {
        const minor = m
          .slice(1)
          .map((row) => row.filter((_, colIdx) => colIdx !== j));

        const cofactor = Math.pow(-1, j) * m[0][j];
        const minorDet = calculateDet(minor, depth + 1);

        if (depth === 0) {
          const sign = j % 2 === 0 ? "+" : "-";
          steps.push(`${indent}${sign} ${m[0][j]} × M${0}${j}`);
        }

        det += cofactor * minorDet;
      }

      if (depth === 0) {
        steps.push("");
        steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        steps.push(`✅ DETERMINANTE = ${det}`);
      }

      return det;
    };

    const determinant = calculateDet(mat);
    return { determinant, steps };
  };

  const chioMethod = (mat: number[][]) => {
    const steps: string[] = [];

    steps.push("📐 MÉTODO DE CHIÒ (Condensação)");
    steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    steps.push("");

    if (mat[0][0] === 0) {
      steps.push("⚠️  O pivô a₁₁ é zero. Tentando trocar linhas...");
      let swapped = false;
      for (let i = 1; i < mat.length; i++) {
        if (mat[i][0] !== 0) {
          [mat[0], mat[i]] = [mat[i], mat[0]];
          steps.push(`✓ Linha 1 trocada com linha ${i + 1}`);
          swapped = true;
          break;
        }
      }
      if (!swapped) {
        return {
          determinant: 0,
          steps: [...steps, "❌ Determinante = 0 (primeira coluna toda nula)"],
        };
      }
      steps.push("");
    }

    let currentMatrix = mat.map((row) => [...row]);
    let iteration = 0;
    let pivotProduct = 1;

    while (currentMatrix.length > 2) {
      const n = currentMatrix.length;
      const pivot = currentMatrix[0][0];

      steps.push(`ITERAÇÃO ${iteration + 1}:`);
      steps.push(`Matriz atual (${n}×${n}):`);
      currentMatrix.forEach((row) => {
        steps.push(
          `[ ${row.map((val) => val.toFixed(2).padStart(7)).join("  ")} ]`
        );
      });
      steps.push(`Pivô a₁₁ = ${pivot}`);
      steps.push("");

      const newMatrix: number[][] = [];

      for (let i = 1; i < n; i++) {
        const newRow: number[] = [];
        for (let j = 1; j < n; j++) {
          const value =
            (currentMatrix[0][0] * currentMatrix[i][j] -
              currentMatrix[0][j] * currentMatrix[i][0]) /
            (iteration === 0 ? 1 : Math.pow(pivotProduct, 1));
          newRow.push(value);
        }
        newMatrix.push(newRow);
      }

      if (iteration === 0) {
        steps.push("Aplicando fórmula de Chiò:");
        steps.push("Cᵢⱼ = (a₁₁ × aᵢⱼ - a₁ⱼ × aᵢ₁)");
      }

      pivotProduct = pivot;
      currentMatrix = newMatrix;
      iteration++;
      steps.push("");
    }

    // Final 2x2
    steps.push("Matriz 2×2 final:");
    currentMatrix.forEach((row) => {
      steps.push(
        `[ ${row.map((val) => val.toFixed(2).padStart(7)).join("  ")} ]`
      );
    });
    steps.push("");

    const finalDet =
      currentMatrix[0][0] * currentMatrix[1][1] -
      currentMatrix[0][1] * currentMatrix[1][0];

    steps.push(
      `Determinante 2×2 = ${currentMatrix[0][0].toFixed(
        2
      )} × ${currentMatrix[1][1].toFixed(2)} - ${currentMatrix[0][1].toFixed(
        2
      )} × ${currentMatrix[1][0].toFixed(2)}`
    );
    steps.push("");
    steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    steps.push(`✅ DETERMINANTE = ${finalDet.toFixed(4)}`);

    return { determinant: finalDet, steps };
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
