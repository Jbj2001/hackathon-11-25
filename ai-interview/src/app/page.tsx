"use client";

import { useState } from 'react';
import SplashCursor from '../components/SplashCursor';
import { api } from '~/trpc/react'; 
import { useRouter } from 'next/navigation';

export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  // tRPC mutation for starting interview
  const startInterview = api.job.submitJobUrl.useMutation({
    onSuccess: (data) => {
      console.log('Interview started successfully:', data);
      // Go to interview page
      router.push(`/interview/${data.job.id}`);
    },
    onError: (error) => {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please check the URL and try again.');
    },
  });

  const {
    data: existingJob,
    refetch: checkIfJobExists,
  } = api.job.checkIfJobExists.useQuery(
    { url },
    { enabled: false }
  );

  const handleStartInterview = async () => {
    if (!url) return;

    const result = await checkIfJobExists();

    if (result.data?.exists && result.data.job) {
      router.push(`/interview/${result.data.job.id}`);
    }
  
    
    

    startInterview.mutate({ url });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6 relative overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto">
        {/* Main Content */}
        <div className="w-full space-y-12 relative z-10">
          {/* Title Section */}
          <div className="text-center space-y-4">
          <div className="inline-block relative">
        {/* Animated gradient background behind text */}
        <div className="absolute inset-0 rounded-xl blur-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-30 animate-pulse"></div>

              <h1 className="relative text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
                Interview Hero
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Your AI agent that helps you <span className="font-semibold text-indigo-600">ace your interviews</span>
            </p>
          </div>

          {/* Glassmorphic Card for URL Input */}
          <div className="relative group">
            {/* Glassmorphic background with hover effect */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.15)]" />
            
            {/* Content */}
            <div className="relative z-10 p-8 sm:p-10">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Job Posting URL
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && url && !startInterview.isPending) {
                        handleStartInterview();
                      }
                    }}
                    placeholder="Enter a job posting URL here"
                    disabled={startInterview.isPending}
                    className="flex-1 px-5 py-4 border border-white/60 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-gray-800 placeholder:text-gray-400 disabled:opacity-50"
                  />
                  <button
                    onClick={handleStartInterview}
                    disabled={!url || startInterview.isPending}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                  >
                    {startInterview.isPending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Start Interview'
                    )}
                  </button>
                </div>
                
                {/* Error message */}
                {startInterview.isError && (
                  <div className="mt-3 p-3 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      {startInterview.error?.message || 'Failed to start interview. Please try again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "🎯",
                title: "Tailored Questions",
                description: "Get questions specific to your job posting"
              },
              {
                icon: "💡",
                title: "AI Feedback",
                description: "Receive instant feedback on your answers"
              },
              {
                icon: "📈",
                title: "Track Progress",
                description: "Monitor your improvement over time"
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 shadow-lg transition-all duration-300 group-hover:bg-white/40 group-hover:shadow-xl" />
                <div className="relative z-10 p-6 text-center space-y-3">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Tip */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              💡 Tip: Works with job postings from LinkedIn, Indeed, and most career sites
            </p>
          </div>
        </div>
      </div>

      {/* Splash Cursor - Full screen behind content */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SplashCursor />
      </div>
    </div>
  );
}