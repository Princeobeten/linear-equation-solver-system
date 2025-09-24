'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

interface Solution {
  variables: Record<string, number>;
}

interface EquationRecord {
  _id: string;
  equations: string[];
  method: string;
  solution: Solution;
  createdAt: string;
}

export default function History() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [equations, setEquations] = useState<EquationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    // Load equation history if user is authenticated
    if (status === 'authenticated' && session.user?.id) {
      fetchHistory();
    }
  }, [status, session, router]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout
      
      const response = await fetch(
        `/api/history?userId=${session?.user?.id}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Get more detailed error message if available
        let errorMessage = 'Failed to fetch history';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If response body isn't valid JSON, use default message
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Check if we got a warning with sample data
      if (data.warning) {
        console.warn('Server warning:', data.warning);
        setError('Connection issue: Showing sample data');
      }
      
      setEquations(data.equations);
    } catch (error) {
      console.error('Error fetching history:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timed out. Database connection issue.');
        } else {
          setError(`Failed to load equation history: ${error.message}`);
        }
      } else {
        setError('Failed to load equation history: Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Equation History</h1>
          <p className="text-gray-600">Your previously solved equations</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        ) : equations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't solved any equations yet.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Solve an Equation
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {equations.map((eq) => (
              <div key={eq._id} className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Equations:</h3>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    {eq.equations.map((eqStr, i) => (
                      <div key={i} className="font-mono">{eqStr}</div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Method:</h3>
                  <div className="mt-1 text-gray-600">{eq.method}</div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Solution:</h3>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {eq.solution && eq.solution.variables && Object.entries(eq.solution.variables).map(([variable, value]) => (
                      <div key={variable} className="bg-gray-50 p-2 rounded shadow-sm">
                        <span className="font-mono">{variable} = {value}</span>
                      </div>
                    ))}
                    {(!eq.solution || !eq.solution.variables) && (
                      <div className="bg-yellow-50 p-2 rounded shadow-sm col-span-full">
                        <span className="font-mono">Solution data incomplete</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  Solved on {formatDate(eq.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
