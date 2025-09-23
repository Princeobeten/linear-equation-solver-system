'use client';

import { useState } from 'react';

interface SolutionDisplayProps {
  solution: {
    status: 'solved' | 'inconsistent' | 'dependent' | 'error';
    variables: Record<string, number> | null;
    message?: string;
    steps?: string[];
  } | null;
  equations: string[];
  method: string;
  onSave: () => void;
}

export default function SolutionDisplay({
  solution,
  equations,
  method,
  onSave,
}: SolutionDisplayProps) {
  if (!solution) {
    return null;
  }
  
  const [showSteps, setShowSteps] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3xl mt-6">
      <h2 className="text-2xl font-semibold mb-4">Solution</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">System of Equations:</h3>
        <div className="bg-gray-50 p-3 rounded-md mt-2">
          {equations.map((eq, index) => (
            <div key={index} className="font-mono">{eq}</div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">Method:</h3>
        <div className="mt-1 text-gray-600">{method}</div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700">Result:</h3>
        
        {solution.status === 'solved' && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-700 font-semibold mb-2">System solved successfully!</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {solution.variables && Object.entries(solution.variables).map(([variable, value]) => (
                <div key={variable} className="bg-white p-2 rounded shadow-sm">
                  <span className="font-mono">{variable} = {value}</span>
                </div>
              ))}
            </div>
            
            {solution.steps && solution.steps.length > 0 && (
              <div className="mt-4">
                <button 
                  onClick={() => setShowSteps(!showSteps)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  {showSteps ? 'Hide Calculation Steps' : 'Show Calculation Steps'}
                  <svg className={`ml-1 h-5 w-5 transform ${showSteps ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSteps && (
                  <div className="mt-3 bg-white border border-gray-200 rounded-md p-3 overflow-x-auto">
                    <h4 className="text-md font-medium mb-2">Calculation Steps:</h4>
                    {solution.steps.map((step, index) => (
                      <div key={index} className="mb-2">
                        <pre className="whitespace-pre font-mono text-xs">{step}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {solution.status === 'inconsistent' && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{solution.message}</div>
          </div>
        )}
        
        {solution.status === 'dependent' && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="text-yellow-700">{solution.message}</div>
          </div>
        )}
        
        {solution.status === 'error' && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">Error: {solution.message}</div>
          </div>
        )}
      </div>
      
      {solution.status === 'solved' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save Result
          </button>
        </div>
      )}
    </div>
  );
}
