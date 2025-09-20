'use client';

import { useState } from 'react';
import EquationInput from './components/EquationInput';
import SolutionDisplay from './components/SolutionDisplay';
import Navbar from './components/Navbar';
import ErrorDisplay from './components/ErrorDisplay';
import { useSession } from 'next-auth/react';
import { Solution } from './types';

import dynamic from 'next/dynamic';

// Dynamically import the debug component to avoid SSR issues
const DebugAuth = dynamic(() => import('./debug-auth'), { ssr: false });

export default function Home() {
  const { data: session } = useSession();
  const [equations, setEquations] = useState<string[]>([]);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [method, setMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const handleSolve = async (eqs: string[], method: string) => {
    setIsLoading(true);
    setSolution(null);
    setSaveMessage('');
    setEquations(eqs);
    setMethod(method);

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equations: eqs,
          method,
          userId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSolution(data.solution);
      } else {
        setSolution({
          status: 'error',
          variables: null,
          message: data.error || 'An error occurred while solving the equations',
        });
      }
    } catch (error) {
      console.error('Error solving equations:', error);
      setSolution({
        status: 'error',
        variables: null,
        message: 'Failed to connect to the server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id || !solution?.variables) {
      setSaveMessage('You must be logged in to save solutions');
      return;
    }

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equations,
          method,
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        setSaveMessage('Solution saved successfully!');
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      } else {
        setSaveMessage('Failed to save solution');
      }
    } catch (error) {
      console.error('Error saving solution:', error);
      setSaveMessage('Failed to connect to the server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Linear Equation Solver</h1>
          <p className="text-gray-600">Solve systems of linear equations with multiple variables</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-md inline-block mx-auto text-left">
            <h3 className="font-semibold text-blue-700 mb-2">Example Systems:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">2 Equations:</p>
                <pre className="bg-white p-2 rounded text-xs">2x + y = 5
x - y = 1</pre>
              </div>
              <div>
                <p className="font-medium">3 Equations:</p>
                <pre className="bg-white p-2 rounded text-xs">x + y + z = 6
2x - y + z = 3
x + 2y - z = 2</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <EquationInput onSolve={handleSolve} />
          
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {solution && (
            <SolutionDisplay 
              solution={solution} 
              equations={equations} 
              method={method} 
              onSave={handleSave} 
            />
          )}
          
          {saveMessage && (
            <div className={`mt-2 text-center py-2 px-4 rounded ${saveMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {saveMessage}
            </div>
          )}
          
          {!session && solution && solution.status === 'solved' && (
            <div className="mt-2 text-center text-gray-500">
              <p>Sign in to save this solution to your history</p>
            </div>
          )}
          
          {/* <div className="mt-8 text-center">
            <button 
              onClick={() => setShowDebug(!showDebug)} 
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </button>
            {showDebug && <DebugAuth />}
          </div> */}
        </div>
      </main>
    </div>
  );
}
