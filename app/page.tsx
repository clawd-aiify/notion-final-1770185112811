'use client';

import { useEffect, useState } from 'react';

interface ApiCall {
  _id: string;
  endpoint: string;
  method: string;
  timestamp: string;
  request: any;
  response: any;
}

export default function Home() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/calls');
      if (!res.ok) {
        setCalls([]);
        return;
      }
      const data = await res.json();
      // Handle both array and {calls: []} response formats
      setCalls(Array.isArray(data) ? data : data.calls || []);
    } catch (error) {
      console.error('Error fetching calls:', error);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            API Sandbox
          </h1>
          <p className="text-gray-600">
            Mock API with request/response logging
          </p>
        </header>

        {/* Endpoints Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Available Endpoints</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                POST
              </span>
              <code className="text-sm">/api/query</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                POST
              </span>
              <code className="text-sm">/api/search</code>
            </div>
          </div>
        </div>

        {/* API Calls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              API Calls ({calls.length})
            </h2>
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No API calls yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {calls.map((call) => (
                  <div
                    key={call._id}
                    onClick={() => setSelectedCall(call)}
                    className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedCall?._id === call._id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                        {call.method}
                      </span>
                      <code className="text-sm text-gray-700">
                        {call.endpoint}
                      </code>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(call.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            {selectedCall ? (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Endpoint</h3>
                  <code className="block bg-gray-100 p-2 rounded text-sm">
                    {selectedCall.method} {selectedCall.endpoint}
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Request</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                    {JSON.stringify(selectedCall.request, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Response</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                    {JSON.stringify(selectedCall.response, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Select an API call to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
