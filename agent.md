# Job Interview AI Agent Implementation Guide

## Overview
This guide explains how job data flows from your web app to the AI agent to conduct personalized interviews.

## Data Flow Architecture

```
User submits job URL
    ↓
Job scraped & saved to DB (with ID)
    ↓
User redirected to /interview/[jobId]
    ↓
Frontend fetches job data from DB
    ↓
Job data passed to LiveKit via participant metadata
    ↓
AI Agent receives job data and conducts tailored interview
```

## Key Components

### 1. Home Page (`page.tsx`)
- User submits job posting URL
- Job data is scraped and saved to database
- User is redirected to `/interview/[jobId]`

### 2. Job Router (`job.ts`)
- `submitJobUrl`: Scrapes and saves job data
- `getJobById`: Retrieves job data for interview page

### 3. Interview Page (`/interview/[jobId]/page.tsx`)
- Fetches job data using jobId
- Requests LiveKit token with job metadata
- Optionally dispatches agent with job context
- Displays interview interface

### 4. Token API (`/api/livekit/token/route.ts`)
- Generates LiveKit access token
- Attaches job data as participant metadata
- Grants room permissions

### 5. AI Agent (`agent.py`)
- Reads job data from participant/room metadata
- Generates custom interview instructions
- Conducts personalized interview

## Setup Instructions

### 1. Update File Structure
Create the dynamic route for interviews:
```
app/
  interview/
    [jobId]/
      page.tsx  (Use the updated interview page code)
```

### 2. Update Your Database Schema
Ensure your Job model has all required fields:
```prisma
model Job {
  id           String   @id @default(cuid())
  jobTitle     String
  companyName  String
  description  String   @db.Text
  requirements String   @db.Text
  companyInfo  String?  @db.Text
  location     String?
  jobType      String?
  salaryRange  String?
  sourceUrl    String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 3. Environment Variables
Make sure you have these set in `.env.local`:
```bash
# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com

# OpenAI for the agent
OPENAI_API_KEY=your-openai-key

# Database
DATABASE_URL=your-database-url
```

### 4. Install Python Dependencies
```bash
pip install livekit-agents livekit-plugins-openai livekit-plugins-silero
```

### 5. Run Your Agent
```bash
python agent.py dev
```

## How Job Data Reaches the Agent

### Method 1: Participant Metadata (Recommended)
The job data is attached to the participant's metadata when the token is created:

```typescript
// In token API
const at = new AccessToken(apiKey, apiSecret, {
  identity: participantName,
  metadata: JSON.stringify(jobData), // Job data here
});
```

```python
# In agent.py
async for participant in ctx.room.remote_participants.values():
    if participant.metadata:
        job_data = json.loads(participant.metadata)
```

### Method 2: Room Metadata (Alternative)
You can also set room metadata when creating/joining the room:

```python
# In agent.py
if ctx.room.metadata:
    job_data = json.loads(ctx.room.metadata)
```

## Testing the Implementation

### 1. Start Your Development Servers
```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: LiveKit agent
python agent.py dev

# Terminal 3: LiveKit server (if running locally)
livekit-server --dev
```

### 2. Test the Flow
1. Go to `http://localhost:3000`
2. Paste a job posting URL (e.g., from LinkedIn or Indeed)
3. Click "Start Interview"
4. Wait for job processing
5. Should redirect to interview page
6. Agent should greet you with job-specific context

### 3. Verify Job Data is Received
Check your agent logs for:
```
INFO: Loaded job data for position: Software Engineer
```

### 4. Verify Interview Questions
The agent should ask questions related to:
- The specific job title
- Required skills from the job posting
- Company information
- Relevant experience

## Troubleshooting

### Agent doesn't receive job data
1. Check participant metadata in token API logs
2. Verify JSON serialization is correct
3. Check agent logs for parsing errors

### Interview page shows error
1. Verify job ID is valid
2. Check database connection
3. Ensure job exists in database

### Agent asks generic questions
1. Verify job data is in metadata
2. Check agent instructions generation
3. Look for JSON parsing errors in agent logs

### Connection fails
1. Check LiveKit server is running
2. Verify environment variables
3. Check firewall/network settings

## Customization Options

### Modify Interview Style
Edit the `_generate_instructions` method in `InterviewAssistant` class:
```python
def _generate_instructions(self, job_data: dict = None) -> str:
    # Customize the instructions here
    # Add your own interview structure
    # Adjust tone, length, question types, etc.
```

### Add Interview Metrics
Track interview performance:
```python
class InterviewAssistant(Agent):
    def __init__(self, job_data: dict = None):
        super().__init__(instructions=...)
        self.questions_asked = 0
        self.start_time = time.time()
    
    # Add tracking logic
```

### Store Interview Transcripts
Save conversations to database for later review:
```python
# Add to agent.py
@session.on("user_speech_committed")
def on_user_speech(transcript):
    # Save to database
    pass
```

## Next Steps

1. **Add interview scoring**: Rate candidate responses
2. **Generate reports**: Create post-interview summaries
3. **Multi-language support**: Interview in different languages
4. **Video recording**: Save interview sessions
5. **Practice mode**: Allow users to retry questions
6. **Feedback system**: Provide real-time tips

## Additional Resources

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [LiveKit Python SDK](https://github.com/livekit/python-sdks)
- [OpenAI API Reference](https://platform.openai.com/docs/)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)