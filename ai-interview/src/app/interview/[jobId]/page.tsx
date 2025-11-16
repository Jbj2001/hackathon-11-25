"use client";

import { 
  LiveKitRoom
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useParams, useRouter } from "next/navigation";
import BottomBar from "~/components/BottomBar";
import { Track } from "livekit-client";
import InterviewStage from "~/components/InterviewStage";


export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [token, setToken] = useState<string | null>(null);
  const [roomName] = useState(() => `interview-${Date.now()}`);
  const [participantName] = useState(() => `user-${Math.random().toString(36).substring(7)}`);
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch job data
  const { data: jobData, isLoading: isLoadingJob, error: jobError } = api.job.getJobById.useQuery(
    { id: jobId },
    { enabled: !!jobId }
  );

  useEffect(() => {
    // Only fetch token after we have job data
    if (!jobData) return;

    const fetchToken = async () => {
      try {
        setIsConnecting(true);
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName,
            participantName,
            // Pass job data to configure the AI agent
            metadata: JSON.stringify({
              jobId: jobData.id,
              jobTitle: jobData.jobTitle,
              companyName: jobData.companyName,
              description: jobData.description,
              requirements: jobData.requirements,
              companyInfo: jobData.companyInfo,
              location: jobData.location,
              jobType: jobData.jobType,
            }),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
        alert("Failed to connect to interview. Please check your LiveKit configuration.");
      } finally {
        setIsConnecting(false);
      }
    };

    fetchToken();
  }, [roomName, participantName, jobData]);

  // Handle loading and error states
  if (isLoadingJob || isConnecting || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl font-bold">
            {isLoadingJob ? "Loading job details..." : "Connecting to Interview..."}
          </div>
          <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-12 w-12 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (jobError || !jobData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl font-bold">Error</div>
          <div className="text-lg mb-4">
            {jobError?.message || "Failed to load job details"}
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white text-[#2e026d] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  
  if (!serverUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl font-bold">Configuration Error</div>
          <div className="text-lg">NEXT_PUBLIC_LIVEKIT_URL is not set</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100dvh" }}
        onDisconnected={() => {
          console.log("Disconnected from room");
          // Optionally redirect to results page
          // router.push(`/interview/${jobId}/results`);
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2e026d] to-[#15162c] px-6 py-4 shadow-lg">
          <h1 className="text-2xl font-bold text-white">
            AI Interview - {jobData.jobTitle}
          </h1>
          <p className="text-sm text-white/80">
            {jobData.companyName}
          </p>
        </div>

        {/* Main Interview Stage */}

        <InterviewStage />
      </LiveKitRoom>
    </div>
  );
}