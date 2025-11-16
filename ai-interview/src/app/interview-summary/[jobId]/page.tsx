"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

export default function InterviewSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Fetch job data
  const { data: jobData } = api.job.getJobById.useQuery(
    { id: jobId },
    { enabled: !!jobId }
  );

  // Fetch latest interview for this job
  const { data: interviews, isLoading: isLoadingInterviews } = api.job.getById.useQuery(
    { jobId },
    { enabled: !!jobId }
  );

  const latestInterview = interviews?.[0];

  // Simulate analysis completion
  useEffect(() => {
    if (latestInterview?.feedback) {
      setIsAnalyzing(false);
    } else if (latestInterview && !latestInterview.feedback) {
      // Still analyzing
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [latestInterview]);

  if (isLoadingInterviews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading interview data...</p>
        </div>
      </div>
    );
  }

  if (!latestInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Interview Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find an interview for this job.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const transcript = latestInterview.transcript as Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;

  const duration = latestInterview.duration 
    ? `${Math.floor(latestInterview.duration / 60)}m ${latestInterview.duration % 60}s`
    : "N/A";

  // Mock score if not available (replace with actual from API)
  const score = latestInterview.score || 75;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Summary</h1>
          <p className="text-xl text-gray-600">
            {jobData?.jobTitle} at {jobData?.companyName}
          </p>
        </div>

        {/* Analyzing State */}
        {isAnalyzing ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Interview</h2>
            <p className="text-gray-600">Our AI is reviewing your responses and preparing detailed feedback...</p>
          </div>
        ) : (
          <>
            {/* Score Card */}
            <div className={`${getScoreBgColor(score)} rounded-2xl shadow-xl p-8 mb-8 border-2 border-${score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'}-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Score</h2>
                  <p className="text-gray-600">Based on your responses and delivery</p>
                </div>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="text-gray-500 text-sm">out of 100</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Duration</h3>
                  <span className="text-3xl">⏱️</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{duration}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Questions</h3>
                  <span className="text-3xl">💬</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {transcript.filter(m => m.role === 'assistant').length}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Responses</h3>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {transcript.filter(m => m.role === 'user').length}
                </p>
              </div>
            </div>

            {/* Feedback Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Strengths */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💪</span>
                  <h3 className="text-2xl font-bold text-gray-900">Strengths</h3>
                </div>
                <div className="space-y-3">
                  {latestInterview.feedback ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{latestInterview.feedback}</p>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <p className="text-gray-700">Clear and articulate communication throughout the interview</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <p className="text-gray-700">Demonstrated strong technical knowledge relevant to the role</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <p className="text-gray-700">Provided specific examples from past experience</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <p className="text-gray-700">Showed enthusiasm and genuine interest in the position</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📈</span>
                  <h3 className="text-2xl font-bold text-gray-900">Areas for Improvement</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <p className="text-gray-700">Try to provide more quantifiable results in your examples</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <p className="text-gray-700">Consider using the STAR method for behavioral questions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <p className="text-gray-700">Prepare more questions about the company culture</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">→</span>
                    <p className="text-gray-700">Work on reducing filler words like "um" and "uh"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📝</span>
                <h3 className="text-2xl font-bold text-gray-900">Detailed Analysis</h3>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Your interview performance showed strong potential with several notable highlights. 
                  You demonstrated a solid understanding of the role requirements and effectively 
                  communicated your relevant experience.
                </p>
                <p className="mb-4">
                  Your technical responses were particularly strong, showing depth of knowledge in 
                  key areas. You successfully conveyed your problem-solving approach and provided 
                  concrete examples that illustrated your capabilities.
                </p>
                <p>
                  To further improve, focus on structuring your behavioral responses using the STAR 
                  method (Situation, Task, Action, Result). This will help you deliver more impactful 
                  answers that clearly demonstrate your value proposition.
                </p>
              </div>
            </div>

            {/* Transcript Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  <h3 className="text-2xl font-bold text-gray-900">Interview Transcript</h3>
                </div>
                <button
                  onClick={() => {/* Download transcript */}}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  Download Full Transcript
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transcript.slice(0, 6).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      msg.role === 'assistant'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'bg-gray-50 border-l-4 border-gray-500'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {msg.role === 'assistant' ? 'Interviewer' : 'You'}
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                  </div>
                ))}
                {transcript.length > 6 && (
                  <p className="text-center text-gray-500 text-sm">
                    ... and {transcript.length - 6} more messages
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/interview/${jobId}`)}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Practice Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
          >
            Try Different Job
          </button>
        </div>
      </div>
    </div>
  );
}