'use client';

interface SolutionDisplayProps {
  solution: {
    status: 'solved' | 'inconsistent' | 'dependent' | 'error';
    variables: Record<string, number> | null;
    message?: string;
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
