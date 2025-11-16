"use client";

import { useLocalParticipant, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function SelfView() {
  const { localParticipant } = useLocalParticipant();

  // Get the camera track publication
  const cameraPublication = localParticipant?.getTrackPublication(Track.Source.Camera);

  if (!cameraPublication || !localParticipant) {
    return (
      <div className="absolute top-4 right-4 h-32 w-48 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-gray-900 flex items-center justify-center">
        <span className="text-white text-sm">Camera Off</span>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 h-32 w-48 rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black">
      <VideoTrack
        trackRef={{
          participant: localParticipant,
          source: Track.Source.Camera,
          publication: cameraPublication,
        }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}