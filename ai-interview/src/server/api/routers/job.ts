// src/server/api/routers/job.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { parseHtml } from '../../../hooks/use-job-parser';
import { db } from '../../db';
async function scrapeJobPosting(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html || html.trim().length === 0) {
      throw new Error('Retrieved HTML is empty');
    }

    return {
      html,
      contentType: response.headers.get('content-type') || 'text/html',
      statusCode: response.status,
    };
  } catch (error) {
    console.error('Error scraping job posting:', error);
    throw new Error(
      error instanceof Error 
        ? `Scraping failed: ${error.message}` 
        : 'Failed to scrape job posting'
    );
  }
}

export const jobRouter = createTRPCRouter({
  submitJobUrl: publicProcedure
    .input(
      z.object({
        url: z.string().url('Please enter a valid URL'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('Processing job URL:', input.url);
        
        // Scrape the job posting
        const scrapedData = await scrapeJobPosting(input.url);
        
        console.log('Successfully scraped job posting');
        console.log('HTML length:', scrapedData.html.length);
        console.log('Content type:', scrapedData.contentType);
        
        const parsedJob = await parseHtml(scrapedData.html);
        
        // Save to database
        const savedJob = await db.job.create({
          data: {
            jobTitle: parsedJob.jobTitle,
            companyName: parsedJob.companyName,
            description: parsedJob.description,
            requirements: parsedJob.requirements,
            companyInfo: parsedJob.companyInfo,
            location: parsedJob.location || null,
            jobType: parsedJob.jobType || null,
            salaryRange: parsedJob.salaryRange || null,
            sourceUrl: input.url
          }
        });
        
        return {
          success: true,
          message: 'Job successfully processed and saved',
          job: savedJob
        };
      } catch (error) {
        console.error('Error processing job URL:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error 
            ? error.message 
            : 'Failed to process job URL',
        });
      }
    }),
  
    getJobById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const job = await db.job.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!job) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Job not found',
          });
        }

        return job;
      } catch (error) {
        console.error('Error fetching job:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error 
            ? error.message 
            : 'Failed to fetch job',
        });
      }
    }),

    // returns an interview info based on interview id
    getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const interview = await db.interview.findUnique({
          where: {
            id: input.id,
          },
          include: {
            job: true,
          },
        });

        if (!interview) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Interview not found',
          });
        }

        return interview;
      } catch (error) {
        console.error('Error fetching interview:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch interview',
        });
      }
    }),

  // Save transcript (called from agent)
  saveTranscript: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        roomName: z.string(),
        startTime: z.string(),
        endTime: z.string().optional(),
        messages: z.array(
          z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
            timestamp: z.string(),
          })
        ),
        durationSeconds: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const interview = await db.interview.create({
          data: {
            jobId: input.jobId!,
            roomName: input.roomName,
            startTime: new Date(input.startTime),
            endTime: input.endTime ? new Date(input.endTime) : new Date(),
            duration: input.durationSeconds ? Math.round(input.durationSeconds) : null,
            transcript: input.messages,
          },
        });

        return {
          success: true,
          interviewId: interview.id,
        };
      } catch (error) {
        console.error('Error saving transcript:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save transcript',
        });
      }
    }),

  // Get formatted transcript text
  getTranscriptText: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const interview = await db.interview.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!interview) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Interview not found',
          });
        }

        // Format transcript as text
        const messages = interview.transcript as Array<{
          role: string;
          content: string;
          timestamp: string;
        }>;

        const formattedText = messages
          .map((msg) => {
            const speaker = msg.role === 'assistant' ? 'Interviewer' : 'Candidate';
            return `${speaker}: ${msg.content}`;
          })
          .join('\n\n');

        return {
          text: formattedText,
          messages,
        };
      } catch (error) {
        console.error('Error fetching transcript text:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch transcript',
        });
      }
    }),


});