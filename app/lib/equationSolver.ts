/**
 * Linear Equation Solver
 * Contains implementations of different methods to solve systems of linear equations.
 */

interface Solution {
  status: 'solved' | 'inconsistent' | 'dependent' | 'error';
  variables: Record<string, number> | null;
  message?: string;
  steps?: string[];
}

/**
 * Parses a string representation of a linear equation and returns the coefficients and constants.
 * @param equations Array of equation strings (e.g., ["2x+3y=6", "x-y=1"])
 * @returns Object containing matrix of coefficients, variables and constants
 */
export function parseEquations(equations: string[]) {
  // First, find all variables present in the system
  const variableSet = new Set<string>();
  
  // Regular expression to match variable terms (e.g., 2x, -3y, z)
  const variableRegex = /([+-]?\s*\d*\.?\d*)\s*([a-zA-Z])/g;
  
  equations.forEach(equation => {
    let match;
    while ((match = variableRegex.exec(equation)) !== null) {
      variableSet.add(match[2]);
    }
  });
  
  // Sort variables to ensure consistent order
  const variables = Array.from(variableSet).sort();
  
  // Initialize coefficient matrix and constants vector
  const coefficients: number[][] = [];
  const constants: number[] = [];
  
  // Parse each equation
  equations.forEach(equation => {
    // Split equation into left and right side
    const sides = equation.split('=');
    if (sides.length !== 2) {
      throw new Error(`Invalid equation format: ${equation}`);
    }
    
    const leftSide = sides[0].trim();
    const rightSide = sides[1].trim();
    
    // Initialize coefficients for this equation with zeros
    const equationCoefficients = Array(variables.length).fill(0);
    
    // Process left side terms
    let leftTerms = leftSide.replace(/-/g, '+-').split('+').filter(term => term !== '');
    for (const term of leftTerms) {
      const match = term.match(/([+-]?\s*\d*\.?\d*)\s*([a-zA-Z])/);
      if (match) {
        const coefficient = match[1] === '-' ? -1 : match[1] === '' || match[1] === '+' ? 1 : parseFloat(match[1]);
        const variable = match[2];
        const index = variables.indexOf(variable);
        equationCoefficients[index] = coefficient;
      }
    }
    
    // Process right side constant
    // For simplicity, we assume right side is just a constant number
    const constant = parseFloat(rightSide);
    
    coefficients.push(equationCoefficients);
    constants.push(constant);
  });
  
  return { coefficients, variables, constants };
}

/**
 * Solves a system of linear equations using Gaussian elimination.
 * @param equations Array of equation strings (e.g., ["2x+3y=6", "x-y=1"])
 * @returns Solution object
 */
export function gaussianElimination(equations: string[]): Solution {
  try {
    const { coefficients, variables, constants } = parseEquations(equations);
    
    const n = coefficients.length; // Number of equations
    const m = variables.length;    // Number of variables
    
    // Create augmented matrix [coefficients | constants]
    const augmentedMatrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      augmentedMatrix.push([...coefficients[i], constants[i]]);
    }

    // Store calculation steps
    const steps: string[] = [];
    
    // Initial matrix
    steps.push(`Initial augmented matrix:`);
    steps.push(formatAugmentedMatrix(augmentedMatrix, variables));
    
    // Forward elimination
    for (let i = 0; i < Math.min(n, m); i++) {
      // Find pivot
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
          maxRow = j;
        }
      }
      
      // Swap rows if needed
      if (maxRow !== i) {
        [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
        steps.push(`Swap rows ${i+1} and ${maxRow+1}:`);
        steps.push(formatAugmentedMatrix(augmentedMatrix, variables));
      }
      
      // Skip if pivot is zero
      if (Math.abs(augmentedMatrix[i][i]) < 1e-10) {
        steps.push(`Skipping row ${i+1} due to zero pivot.`);
        continue;
      }
      
      // Normalize pivot row
      const pivot = augmentedMatrix[i][i];
      for (let j = i; j <= m; j++) {
        augmentedMatrix[i][j] /= pivot;
      }
      steps.push(`Normalize row ${i+1} (divide by ${pivot.toFixed(4)}):`);
      steps.push(formatAugmentedMatrix(augmentedMatrix, variables));
      
      // Eliminate other rows
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const factor = augmentedMatrix[j][i];
          if (Math.abs(factor) < 1e-10) continue;
          
          for (let k = i; k <= m; k++) {
            augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
          }
          steps.push(`Eliminate variable ${variables[i]} from row ${j+1} (subtract ${factor.toFixed(4)} times row ${i+1}):`);
          steps.push(formatAugmentedMatrix(augmentedMatrix, variables));
        }
      }
    }
    
    // Check for inconsistency
    for (let i = 0; i < n; i++) {
      let allZeros = true;
      for (let j = 0; j < m; j++) {
        if (Math.abs(augmentedMatrix[i][j]) > 1e-10) {
          allZeros = false;
          break;
        }
      }
      
      if (allZeros && Math.abs(augmentedMatrix[i][m]) > 1e-10) {
        return {
          status: 'inconsistent',
          variables: null,
          message: 'The system is inconsistent (no solution exists)',
          steps: steps
        };
      }
    }
    
    // Check if system is underdetermined
    if (m > n) {
      return {
        status: 'dependent',
        variables: null,
        message: 'The system has infinitely many solutions',
        steps: steps
      };
    }
    
    // Back substitution
    const solution: Record<string, number> = {};
    for (let i = 0; i < Math.min(n, m); i++) {
      if (Math.abs(augmentedMatrix[i][i]) < 1e-10) {
        return {
          status: 'dependent',
          variables: null,
          message: 'The system has infinitely many solutions',
          steps: steps
        };
      }
      solution[variables[i]] = parseFloat(augmentedMatrix[i][m].toFixed(4));
    }
    
    return {
      status: 'solved',
      variables: solution,
      steps: steps
    };
  } catch (error) {
    return {
      status: 'error',
      variables: null,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Solves a system of linear equations using Matrix Inversion.
 * This is a placeholder that uses Gaussian elimination for now.
 * @param equations Array of equation strings
 * @returns Solution object
 */
export function matrixInversion(equations: string[]): Solution {
  // For the prototype, we'll just use Gaussian Elimination
  // In a real implementation, this would be replaced with proper matrix inversion
  return gaussianElimination(equations);
}

/**
 * Formats an augmented matrix as a string for display in the steps
 * @param matrix The augmented matrix
 * @param variables The variable names
 * @returns Formatted string representation of the matrix
 */
function formatAugmentedMatrix(matrix: number[][], variables: string[]): string {
  const m = variables.length;
  let result = '';
  
  // Add header row with variable names
  result += '| ';
  for (let j = 0; j < m; j++) {
    result += `${variables[j].padStart(8)} | `;
  }
  result += '  RHS  |\n';
  
  // Add separator
  result += '|' + '-'.repeat((m + 1) * 11 - 1) + '|\n';
  
  // Add matrix rows
  for (let i = 0; i < matrix.length; i++) {
    result += '| ';
    for (let j = 0; j < m; j++) {
      result += `${matrix[i][j].toFixed(4).padStart(8)} | `;
    }
    result += `${matrix[i][m].toFixed(4).padStart(6)} |\n`;
  }
  
  return result;
}
