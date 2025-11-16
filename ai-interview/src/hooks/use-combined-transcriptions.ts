 
import { useMemo } from "react";
import { useTracks } from "@livekit/components-react";


import {
  useTrackTranscription,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Track } from "livekit-client";



// In use-combined-transcriptions.ts
export default function useCombinedTranscriptions() {
  const { agentTranscriptions } = useVoiceAssistant();
  const allTracks = useTracks([{ 
    source: Track.Source.Microphone,
    withPlaceholder: false 
  }]);
  const micTrackRef = allTracks[0];
  const { segments: userTranscriptions } = useTrackTranscription(micTrackRef);

  return useMemo(() => {
    const agentTranscripts = agentTranscriptions.map((val: any) => ({
      text: val.text,
      role: 'assistant',
      timestamp: val.timestamp || Date.now()
    }));

    const userTranscripts = userTranscriptions.map((val: any) => ({
      text: val.text,
      role: 'user',
      timestamp: val.timestamp || Date.now()
    }));

    return [...agentTranscripts, ...userTranscripts]
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [agentTranscriptions, userTranscriptions]);
}