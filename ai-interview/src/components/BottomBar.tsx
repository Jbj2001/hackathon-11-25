"use client";

import {
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";

import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useEffect, useCallback } from "react";
interface BottomBarProps {
  transcriptions?: Array<{
    text: string;
    role: 'user' | 'assistant';
    timestamp: number;
  }>;
  onEndInterview?: () => void;
}

export default function BottomBar({ transcriptions, onEndInterview }: BottomBarProps) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const handleEndCall = useCallback(() => {
    if (room) {
      room.disconnect();
    }
    router.push('/');
  }, [room, router]);

  const handleEndInterview = useCallback(async () => {
    if (onEndInterview) {
      onEndInterview();
    } else {
      // Fallback to regular end call if onEndInterview is not provided
      handleEndCall();
    }
  }, [onEndInterview, handleEndCall]);

  const toggleMic = () => {
    if (!localParticipant) return;
    localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  };

  const toggleCamera = () => {
    if (!localParticipant) return;
    localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  };

 const leave = async () => {
  try {
    // Save the transcript first
    const saveResponse = await fetch('/api/interviews/save-transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: room.name,
        messages: transcriptions || [],
      }),
    });

    if (!saveResponse.ok) {
      throw new Error('Failed to save transcript');
    }

    const saveData = await saveResponse.json();
    const interviewId = saveData.interviewId;

    // Then disconnect from the room
    room.disconnect();

    // Redirect to the interview summary
    if (interviewId) {
      router.push(`/interview-summary/${interviewId}`);
    } else {
      // Fallback to home if no interview ID is returned
      router.push('/');
    }
  } catch (err) {
    console.error('Error during interview end:', err);
    // Even if save fails, still disconnect
    room.disconnect();
    router.push('/');
  }
};

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 bg-black/50 backdrop-blur-lg py-4 px-6 border-t border-white/10">

      {/* Mic */}
      <button
        onClick={toggleMic}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        {localParticipant?.isMicrophoneEnabled ? (
          <Mic className="h-6 w-6 group-hover:scale-110 transition" />
        ) : (
          <MicOff className="h-6 w-6 text-red-500 group-hover:scale-110 transition" />
        )}
      </button>

      {/* Camera */}
      <button
        onClick={toggleCamera}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
      >
        {localParticipant?.isCameraEnabled ? (
          <Camera className="h-6 w-6 group-hover:scale-110 transition" />
        ) : (
          <CameraOff className="h-6 w-6 text-red-500 group-hover:scale-110 transition" />
        )}
      </button>

      {/* Leave */}
      <div className="flex space-x-4">
        <button
          onClick={handleEndInterview}
          className="flex items-center px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          End Interview
        </button>
        <button
          onClick={handleEndCall}
          className="flex items-center justify-center rounded-full bg-red-600 p-3 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>

    </div>
  );
}
