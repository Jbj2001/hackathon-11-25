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
});