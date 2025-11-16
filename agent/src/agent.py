import logging
import json
import asyncio
import httpx
from datetime import datetime

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    inference,
    metrics,
)
from livekit.plugins import noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class InterviewTranscript:
    """Collects and manages interview transcript"""
    
    def __init__(self, job_id: str = None, room_name: str = None):
        self.job_id = job_id
        self.room_name = room_name
        self.messages = []
        self.start_time = datetime.now()
        
    def add_message(self, role: str, content: str, timestamp: datetime = None):
        """Add a message to the transcript"""
        if not content or not content.strip():
            logger.warning(f"Attempted to add empty message for role: {role}")
            return
            
        self.messages.append({
            "role": role,  # "user" or "assistant"
            "content": content.strip(),
            "timestamp": (timestamp or datetime.now()).isoformat()
        })
        logger.info(f"✓ Transcript captured - {role}: {content[:50]}...")

        
    def get_transcript(self) -> dict:
        """Get the full transcript"""
        return {
            "job_id": self.job_id,
            "room_name": self.room_name,
            "start_time": self.start_time.isoformat(),
            "end_time": datetime.now().isoformat(),
            "messages": self.messages,
            "message_count": len(self.messages),
            "duration_seconds": (datetime.now() - self.start_time).total_seconds()
        }
    
    def get_formatted_text(self) -> str:
        """Get transcript as formatted text"""
        lines = []
        for msg in self.messages:
            speaker = "Interviewer" if msg["role"] == "assistant" else "Candidate"
            lines.append(f"{speaker}: {msg['content']}")
        return "\n\n".join(lines)
    
    async def save_to_database(self, api_url: str) -> str:
        """Save transcript to database via API"""
        try:
            transcript_data = self.get_transcript()
            logger.info(f"Attempting to save transcript with {transcript_data['message_count']} messages")
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    api_url,
                    json=transcript_data,
                    timeout=30.0  # Increased timeout
                )
                if response.status_code == 200:
                    data = response.json()
                    interview_id = data.get("interviewId")
                    logger.info(f"✓ Transcript saved successfully with ID {interview_id}")
                    return interview_id
                else:
                    logger.error(f"Failed to save transcript: {response.status_code} - {response.text}")
                    return None  # FIXED: Added return statement
        except Exception as e:
            logger.error(f"Error saving transcript: {e}", exc_info=True)
            return None  # FIXED: Added return statement


class InterviewAssistant(Agent):
    def __init__(self, job_data: dict = None, transcript: InterviewTranscript = None) -> None:
        # Generate interview-specific instructions based on job data
        instructions = self._generate_instructions(job_data)
        super().__init__(instructions=instructions)
        self.job_data = job_data
        self.transcript = transcript

    def _generate_instructions(self, job_data: dict = None) -> str:
        """Generate AI instructions based on job posting data"""
        
        if not job_data:
            return """You are a helpful AI interviewer. The user is interacting with you via voice.
            Conduct a professional job interview by asking relevant questions about their experience, skills, and qualifications.
            Your responses are concise, clear, and professional without complex formatting.
            You are friendly, encouraging, and maintain a professional tone throughout the interview."""
        
        # Extract job details
        job_title = job_data.get('jobTitle', 'this position')
        company_name = job_data.get('companyName', 'our company')
        description = job_data.get('description', '')
        requirements = job_data.get('requirements', '')
        company_info = job_data.get('companyInfo', '')
        location = job_data.get('location', '')
        job_type = job_data.get('jobType', '')
        
        instructions = f"""You are an AI interviewer conducting a professional job interview via voice. The user is interacting with you through speech.

JOB DETAILS:
- Position: {job_title}
- Company: {company_name}
- Location: {location if location else 'Not specified'}
- Job Type: {job_type if job_type else 'Not specified'}

JOB DESCRIPTION:
{description[:500] if description else 'Not provided'}

KEY REQUIREMENTS:
{requirements[:500] if requirements else 'Not provided'}

COMPANY INFORMATION:
{company_info[:300] if company_info else 'Not provided'}

YOUR INTERVIEW APPROACH:
1. Start by warmly greeting the candidate and briefly introducing the position
2. Ask around 6 or 7 relevant questions based on the job requirements and description
3. Focus on: technical skills, experience, problem-solving abilities, cultural fit, and motivation
4. Ask follow-up questions to dive deeper into interesting responses
5. Ask one question at a time and wait for complete answers
6. Provide encouraging feedback during the conversation
7. Conclude by asking if the candidate has questions, then provide constructive summary feedback

IMPORTANT GUIDELINES:
- Keep your responses concise and conversational (2-3 sentences max per turn)
- Avoid complex formatting, bullet points, asterisks, or emojis
- Be professional yet warm and encouraging
- Listen actively and reference previous answers when relevant
- The interview should last about 15-20 minutes (8-12 questions)
- Adapt your questions based on the candidate's experience level
- If the candidate seems nervous, be extra encouraging

Remember: This is a voice conversation, so speak naturally as you would in person."""

        return instructions


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Extract job data from room metadata or participant metadata
    job_data = None
    job_id = None
    
    # Wait for the room to be ready and get metadata
    await ctx.connect()
    
    # Give a moment for participants to join and metadata to be available
    await asyncio.sleep(0.5)
    
    # Try to get job data from participant metadata
    for participant in ctx.room.remote_participants.values():
        if participant.metadata:
            try:
                job_data = json.loads(participant.metadata)
                job_id = job_data.get('jobId') or job_data.get('id')
                logger.info(f"Loaded job data for position: {job_data.get('jobTitle', 'Unknown')}")
                break
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse participant metadata: {e}")
    
    # Alternative: Get from room metadata if not in participant metadata
    if not job_data and ctx.room.metadata:
        try:
            job_data = json.loads(ctx.room.metadata)
            job_id = job_data.get('jobId') or job_data.get('id')
            logger.info(f"Loaded job data from room metadata")
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse room metadata: {e}")
    
    # If still no job data, wait for participant to join and check again
    if not job_data:
        logger.info("Waiting for participant to join with job metadata...")
        participant = await ctx.wait_for_participant()
        if participant.metadata:
            try:
                job_data = json.loads(participant.metadata)
                job_id = job_data.get('jobId') or job_data.get('id')
                logger.info(f"Loaded job data after participant joined: {job_data.get('jobTitle', 'Unknown')}")
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse participant metadata after join: {e}")
    
    if not job_data:
        logger.warning("No job data found, conducting general interview")

    # Initialize transcript collection
    transcript = InterviewTranscript(job_id=job_id, room_name=ctx.room.name)
    logger.info(f"Transcript collection initialized for room: {ctx.room.name}")
    
    # Set up a voice AI pipeline
    session = AgentSession(
        stt=inference.STT(model="assemblyai/universal-streaming", language="en"),
        llm=inference.LLM(model="openai/gpt-4.1-mini"),
        tts=inference.TTS(
            model="cartesia/sonic-3", voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc"
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # FIXED: Set up transcript event handlers with proper closure
    @session.on("user_speech_committed")
    def on_user_speech(msg):
        """Capture user's speech"""
        try:
            content = msg.content if hasattr(msg, 'content') else str(msg)
            logger.info(f"📝 User speech detected: {content[:100]}")
            transcript.add_message("user", content)
        except Exception as e:
            logger.error(f"Error capturing user speech: {e}", exc_info=True)
    
    @session.on("agent_speech_committed")
    def on_agent_speech(msg):
        """Capture agent's speech"""
        try:
            content = msg.content if hasattr(msg, 'content') else str(msg)
            logger.info(f"📝 Agent speech detected: {content[:100]}")
            transcript.add_message("assistant", content)
        except Exception as e:
            logger.error(f"Error capturing agent speech: {e}", exc_info=True)

    # ADDED: Additional event handlers for debugging
    @session.on("user_started_speaking")
    def on_user_started():
        logger.debug("User started speaking")
    
    @session.on("agent_started_speaking")
    def on_agent_started():
        logger.debug("Agent started speaking")

    # Metrics collection
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    async def save_transcript():
        """Save transcript when session ends"""
        message_count = len(transcript.messages)
        logger.info(f"📊 Interview ended. Captured {message_count} messages")
        
        if message_count == 0:
            logger.warning("⚠️ No messages were captured during the interview!")
            logger.warning("This might indicate an event handler issue")
        else:
            logger.info(f"Transcript preview:\n{transcript.get_formatted_text()[:500]}...")
        
        # Always attempt to save, even if empty (for debugging)
        api_url = "http://localhost:3000/api/interviews/save-transcript"
        interview_id = await transcript.save_to_database(api_url)

        if interview_id:
            try:
                local_participant = ctx.room.local_participant
                metadata = {"interviewId": interview_id}
                await local_participant.update_metadata(json.dumps(metadata))
                logger.info(f"✓ Interview ID {interview_id} set in participant metadata")
            except Exception as e:
                logger.error(f"Failed to update participant metadata: {e}")
        else:
            logger.error("❌ Failed to save transcript to database")

    ctx.add_shutdown_callback(log_usage)
    ctx.add_shutdown_callback(save_transcript)

    # Start the session with the interview assistant
    await session.start(
        agent=InterviewAssistant(job_data=job_data, transcript=transcript),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    
    logger.info("✓ Interview agent started and ready")
    logger.info("Event handlers registered for transcript capture")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))