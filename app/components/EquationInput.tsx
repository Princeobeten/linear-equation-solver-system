'use client';

import { useState } from 'react';

interface EquationInputProps {
  onSolve: (equations: string[], method: string) => void;
}

export default function EquationInput({ onSolve }: EquationInputProps) {
  const [numEquations, setNumEquations] = useState<number>(2);
  const [equations, setEquations] = useState<string[]>(['', '']);
  const [method, setMethod] = useState<string>('Gaussian Elimination');

  const handleNumEquationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value);
    setNumEquations(num);
    
    // Adjust the equations array size
    if (num > equations.length) {
      // Add empty equations
      setEquations([...equations, ...Array(num - equations.length).fill('')]);
    } else {
      // Remove excess equations
      setEquations(equations.slice(0, num));
    }
  };

  const handleEquationChange = (index: number, value: string) => {
    const newEquations = [...equations];
    newEquations[index] = value;
    setEquations(newEquations);
  };

  const handleSolve = () => {
    // Filter out any empty equations
    const validEquations = equations.filter(eq => eq.trim() !== '');
    if (validEquations.length < 2) {
      alert('Please enter at least 2 equations');
      return;
    }
    
    onSolve(validEquations, method);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Enter Linear Equations</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Equations:
        </label>
        <select
          value={numEquations}
          onChange={handleNumEquationsChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {[2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Solving Method:
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="Gaussian Elimination">Gaussian Elimination</option>
          <option value="Matrix Inversion">Matrix Inversion</option>
        </select>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="text-sm font-medium text-gray-700">
          Enter equations in the form: ax + by + cz = d
        </div>
        {Array.from({ length: numEquations }).map((_, index) => (
          <div key={index} className="flex items-center">
            <span className="mr-2 text-gray-700">Equation {index + 1}:</span>
            <input
              type="text"
              value={equations[index] || ''}
              onChange={(e) => handleEquationChange(index, e.target.value)}
              placeholder="e.g., 2x + 3y = 6"
              className="flex-1 rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSolve}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Solve System
        </button>
      </div>
    </div>
  );
}
