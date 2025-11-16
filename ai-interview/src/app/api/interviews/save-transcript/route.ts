// app/api/interviews/save-transcript/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export async function POST(req: NextRequest) {
    try {
      const transcript = await req.json();
      
      console.log('Received transcript:', JSON.stringify(transcript, null, 2));
  
      // Validate required fields
      if (!transcript.room_name || !transcript.job_id || !transcript.messages) {
        console.error('Missing required fields:', { 
          hasRoomName: !!transcript.room_name, 
          hasJobId: !!transcript.job_id, 
          hasMessages: !!transcript.messages,
          messageCount: transcript.messages?.length || 0
        });
        return NextResponse.json({ error: "Invalid transcript data" }, { status: 400 });
      }
  
      if (transcript.messages.length === 0) {
        console.error('No messages in transcript');
        return NextResponse.json({ error: "Transcript has no messages" }, { status: 400 });
      }
  
      // Save to file...
      const filename = `transcript_${transcript.room_name}_${new Date()
        .toISOString()
        .replace(/[:.]/g, "_")}.json`;
      const savePath = path.join(process.cwd(), "transcripts");
      if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
      fs.writeFileSync(path.join(savePath, filename), JSON.stringify(transcript, null, 2));
  
      // Map to your tRPC schema
      const caller = appRouter.createCaller(await createTRPCContext({ headers: req.headers }));
      const result = await caller.job.saveTranscript({
        jobId: transcript.job_id,
        roomName: transcript.room_name,
        startTime: transcript.start_time,
        endTime: transcript.end_time,
        messages: transcript.messages,
        durationSeconds: transcript.duration_seconds,
      });
  
      console.log(`Transcript saved: ${filename}`);
      return NextResponse.json({ message: "Transcript saved successfully", filename });
    } catch (error) {
      console.error("Error saving transcript:", error);
      return NextResponse.json({ 
        error: "Failed to save transcript", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  }