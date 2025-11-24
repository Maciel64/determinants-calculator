"use client";

import { Input } from "@/components/ui/input";

interface MatrixInputProps {
  matrix: (number | null)[][];
  onChange: (matrix: (number | null)[][]) => void;
}

export default function MatrixInput({ matrix, onChange }: MatrixInputProps) {
  const handleChange = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = value === "" ? null : parseFloat(value);
    onChange(newMatrix);
  };

  return (
    <div className="inline-block rounded-lg border-2 border-primary/20 bg-muted/30 p-4">
      <div className="flex flex-col gap-2">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((val, j) => (
              <Input
                key={`${i}-${j}`}
                type="number"
                value={val === null ? "" : val}
                onChange={(e) => handleChange(i, j, e.target.value)}
                className="w-16 text-center font-mono"
                step="0.1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
