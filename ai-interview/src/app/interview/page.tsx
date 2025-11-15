"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";

export default function InterviewPage() {
  const [token, setToken] = useState<string | null>(null);
  const [roomName] = useState(() => `interview-${Date.now()}`);
  const [participantName] = useState(() => `user-${Math.random().toString(36).substring(7)}`);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
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
  }, [roomName, participantName]);

  if (isConnecting || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl font-bold">Connecting to Interview...</div>
          <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-12 w-12 mx-auto"></div>
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
    <div className="h-screen w-screen">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100dvh" }}
        onDisconnected={() => {
          console.log("Disconnected from room");
        }}
      >
        <div className="flex h-full flex-col">
          <div className="bg-gradient-to-r from-[#2e026d] to-[#15162c] px-6 py-4">
            <h1 className="text-2xl font-bold text-white">AI Interview</h1>
            <p className="text-sm text-white/80">Room: {roomName}</p>
          </div>
          <div className="flex-1">
            <VideoConference />
          </div>
        </div>
      </LiveKitRoom>
    </div>
  );
}

