'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<string>('');

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setDebugInfo(JSON.stringify(data, null, 2));
    } catch (error) {
      setDebugInfo(`Error checking auth: ${error}`);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 my-4">
      <h2 className="text-xl font-semibold mb-2">Auth Debug</h2>
      
      <div className="mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User ID:</strong> {session?.user?.id || 'Not available'}</p>
        <p><strong>User Email:</strong> {session?.user?.email || 'Not available'}</p>
      </div>
      
      <button
        onClick={checkAuth}
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded"
      >
        Check Auth API
      </button>
      
      {debugInfo && (
        <pre className="bg-gray-100 p-2 mt-4 overflow-auto max-h-60 text-xs">
          {debugInfo}
        </pre>
      )}
    </div>
  );
}
