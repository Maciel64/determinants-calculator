export const calculateDeterminant = (
  mat: number[][],
  calculationMethod: "sarrus" | "laplace" | "chio"
) => {
  switch (calculationMethod) {
    case "sarrus":
      return sarrusMethod(mat);
    case "laplace":
      return laplaceMethod(mat);

    default:
      return { determinant: 0, steps: [] };
  }
};

export const sarrusMethod = (mat: number[][]) => {
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
      steps: ["❌ O método de Sarrus funciona apenas para matrizes 2x2 e 3x3"],
    };
  }

  steps.push("📐 MÉTODO DE SARRUS (Matriz 3x3)");
  steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  steps.push("");

  steps.push("Matriz original:");
  mat.forEach((row, i) => {
    steps.push(
      `[ ${row.map((val) => val.toString().padStart(5)).join("  ")} ]`
    );
  });
  steps.push("");

  steps.push("Extensão da matriz (adicionar primeiras 2 colunas):");
  const extended = mat.map((row, i) => [...row, mat[i][0], mat[i][1]]);
  extended.forEach((row) => {
    steps.push(
      `[ ${row.map((val) => val.toString().padStart(5)).join("  ")} ]`
    );
  });
  steps.push("");

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
  steps.push(`Soma das secundárias = ${s1} + ${s2} + ${s3} = ${s1 + s2 + s3}`);
  steps.push("");

  const determinant = d1 + d2 + d3 - (s1 + s2 + s3);
  steps.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  steps.push(
    `✅ DETERMINANTE = (${d1 + d2 + d3}) - (${s1 + s2 + s3}) = ${determinant}`
  );

  return { determinant, steps };
};

export const laplaceMethod = (mat: number[][]) => {
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
