'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type AnalysisResult = {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  score: number;
};

export default function InterviewResults() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const transcript = searchParams.get('transcript');
    if (!transcript) {
      setError('No transcript data found');
      setLoading(false);
      return;
    }

    const analyzeTranscript = async () => {
      try {
        const response = await fetch('/api/analyze-interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze interview');
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    analyzeTranscript();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Analyzing your interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Analysis</h1>
          <p className="text-gray-600">Here's how you did in your interview</p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Overall Score</h2>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full" 
                  style={{ width: `${analysis?.score || 0}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-gray-500">{analysis?.score || 0}% Match</p>
            </div>
          </div>

          <div className="px-6 py-5">
            <h3 className="text-md font-medium text-gray-900 mb-3">Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{analysis?.summary}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-md font-medium text-green-700">Strengths</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-2">
                {analysis?.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-md font-medium text-red-700">Areas for Improvement</h3>
            </div>
            <div className="px-6 py-4">
              <ul className="list-disc pl-5 space-y-2">
                {analysis?.areasForImprovement.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
