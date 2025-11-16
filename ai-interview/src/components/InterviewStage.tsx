"use client";

import { 
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
  RoomAudioRenderer, useVoiceAssistant, useTrackTranscription
} from "@livekit/components-react";
import "@livekit/components-styles";
import BottomBar from "~/components/BottomBar";
import { Track } from "livekit-client";
import { VideoTrack, AudioTrack } from "@livekit/components-react";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface InterviewStageProps {
  onTranscription: (transcriptions: Array<{text: string, role: string, timestamp: number}>) => void;
  onInterviewEnd: (transcript: string) => void;
}

export default function InterviewStage({ onTranscription, onInterviewEnd }: InterviewStageProps) {
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const router = useRouter();
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{text: string, role: string, timestamp: number}>>([]);
  
  // Get transcriptions
  const allTracks = useTracks([{ 
    source: Track.Source.Microphone,
    withPlaceholder: false 
  }]);
  const micTrackRef = allTracks[0];
  const { segments: userTranscriptions } = useTrackTranscription(micTrackRef);
  const { agentTranscriptions } = useVoiceAssistant();
  
  // Format transcriptions with timestamps
  const formattedTranscriptions = useMemo(() => {
    const user = userTranscriptions.map(segment => ({
      text: segment.text,
      role: 'user' as const,
      // Use current time as timestamp since segment doesn't have one
      timestamp: 'timestamp' in segment ? segment.timestamp : Date.now()
    }));
    
    const agent = agentTranscriptions.map(segment => ({
      text: segment.text,
      role: 'assistant' as const,
      // Use current time as timestamp since segment doesn't have one
      timestamp: 'timestamp' in segment ? segment.timestamp : Date.now()
    }));
    
    // Sort by timestamp to maintain chronological order
    return [...user, ...agent].sort((a, b) => a.timestamp - b.timestamp);
  }, [userTranscriptions, agentTranscriptions]);

  // Handle interview end
  const handleEndInterview = useCallback(async () => {
    try {
      const fullTranscript = formattedTranscriptions
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(t => `${t.role === 'user' ? 'You' : 'Interviewer'}: ${t.text}`)
        .join('\n\n');
      
      // Call the onInterviewEnd callback if provided
      if (onInterviewEnd) {
        await onInterviewEnd(fullTranscript);
      }
      
      setIsInterviewComplete(true);
      
      // Navigate to results page with transcript as URL parameter
      const encodedTranscript = encodeURIComponent(fullTranscript);
      router.push(`/interview/results?transcript=${encodedTranscript}`);
    } catch (error) {
      console.error('Error ending interview:', error);
      // Still navigate even if there's an error, but log it
      const encodedTranscript = encodeURIComponent('Error generating transcript');
      router.push(`/interview/results?transcript=${encodedTranscript}`);
    }
  }, [formattedTranscriptions, onInterviewEnd, router]);

  // Update parent component with transcriptions
  useEffect(() => {
    if (formattedTranscriptions.length > 0) {
      onTranscription(formattedTranscriptions);
    }
  }, [formattedTranscriptions, onTranscription]);

  // Get all tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const localCameraTrack = localParticipant?.getTrackPublication(Track.Source.Camera);
  const agentParticipant = remoteParticipants[0]; // The AI agent
  const agentCameraTrack = agentParticipant?.getTrackPublication(Track.Source.Camera);
  const agentMicTrack = agentParticipant?.getTrackPublication(Track.Source.Microphone);

  // Update parent component when transcriptions change
  useEffect(() => {
    onTranscription(formattedTranscriptions);
  }, [formattedTranscriptions, onTranscription]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Room Audio Renderer */}
      <RoomAudioRenderer />

      {/* Main Video Area - side by side */}
      <div className="flex-1 flex bg-gray-900">
        {/* Agent Video */}
        <div className="flex-1 relative bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          {agentParticipant ? (
            agentCameraTrack ? (
              <VideoTrack
                trackRef={{
                  participant: agentParticipant,
                  source: Track.Source.Camera,
                  publication: agentCameraTrack,
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              // Fallback avatar
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">AI Interviewer</h2>
                <p className="text-gray-300 mt-2">Listening...</p>
              </div>
            )
          ) : (
            <div className="text-white">Waiting for agent...</div>
          )}

          {/* Agent Audio */}
          {agentMicTrack && agentParticipant && (
            <AudioTrack
              trackRef={{
                participant: agentParticipant,
                source: Track.Source.Microphone,
                publication: agentMicTrack,
              }}
            />
          )}
        </div>

        {/* Local Video */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {localCameraTrack ? (
            <VideoTrack
              trackRef={{
                participant: localParticipant,
                source: Track.Source.Camera,
                publication: localCameraTrack,
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Camera Off</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex-shrink-0">
  <BottomBar onEndInterview={handleEndInterview} />
      </div>
    </div>
  );
}
