import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

import { env } from "~/env";

export async function POST(request: NextRequest) {
  try {
    const { roomName, participantName } = await request.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: "Missing roomName or participantName" },
        { status: 400 },
      );
    }

    const at = new AccessToken(
      env.LIVEKIT_API_KEY,
      env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
      },
    );

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}

