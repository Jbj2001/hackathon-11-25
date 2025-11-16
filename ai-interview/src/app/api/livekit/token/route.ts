import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomName, participantName, metadata } = await req.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: "Missing roomName or participantName" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    // Parse job metadata if provided
    let jobData = null;
    if (metadata) {
      try {
        jobData = JSON.parse(metadata);
      } catch (e) {
        console.error("Failed to parse metadata:", e);
      }
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      metadata: metadata, // Pass job data as participant metadata
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    // Here you would also configure your AI agent with the job data
    // This depends on your LiveKit agent implementation
    // You might need to call an agent endpoint or use LiveKit's agent dispatch
    if (jobData) {
      console.log("Configuring AI agent with job data:", {
        jobTitle: jobData.jobTitle,
        companyName: jobData.companyName,
      });
      
      // Example: You could dispatch an agent with custom attributes
      // This would be done via LiveKit's agent dispatch API
      // const agentConfig = {
      //   roomName,
      //   systemPrompt: generateInterviewPrompt(jobData),
      // };
      // await dispatchAgent(agentConfig);
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}