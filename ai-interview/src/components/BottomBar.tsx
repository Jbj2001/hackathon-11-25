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

import { useState, useEffect } from "react";


export default function BottomBar() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<string | null>(null);


  const toggleMic = () => {
    if (!localParticipant) return;
    localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  };

  const toggleCamera = () => {
    if (!localParticipant) return;
    localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  };

  const leave = async () => {
    room.disconnect();
    try {
        const res = await fetch(`/api/interviews/latest?roomName=${room.name}`);
        const data = await res.json();
        if (data.interviewId) {
          router.push(`/interview-summary/${data.interviewId}`);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Failed to fetch interview ID:", err);
        router.push("/");
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
      <button
        onClick={leave}
        className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-white font-medium hover:bg-red-700 transition shadow-lg hover:shadow-red-700/30"
      >
        End Interview
      </button>

    </div>
  );
}
