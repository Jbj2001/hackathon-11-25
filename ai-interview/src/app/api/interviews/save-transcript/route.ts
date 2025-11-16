// app/api/interviews/save-transcript/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function POST(request: Request) {
  try {
    const { roomName, messages } = await request.json();

    if (!roomName) {
      return NextResponse.json(
        { error: 'roomName is required' },
        { status: 400 }
      );
    }
    console.log(messages);

    // Save to database
    // const interview = await db.interview.create({
    //   data: {
    //     roomName,
    //     transcript: messages,
    //     // Add any other fields you need
    //   },
    // });

    return NextResponse.json({ 
      success: true, 
      interviewId: "" 
    });
  } catch (error) {
    console.error('Error saving transcript:', error);
    return NextResponse.json(
      { error: 'Failed to save transcript' },
      { status: 500 }
    );
  }
}