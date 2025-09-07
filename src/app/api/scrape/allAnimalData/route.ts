import { NextResponse, NextRequest } from 'next/server';
import { scrapeAllAnimalData } from '../../../../services/scrapeAnimalData';

export async function POST(request: NextRequest) {
  console.log('Received request to scrape all animal data');
  try {
    const allAnimalIds = await request.json();
    console.log(`Scraping data for ${allAnimalIds.length} animals`);
    const animals = await scrapeAllAnimalData(allAnimalIds);
    console.log(`Scraped data for ${animals.length} animals`);

    return NextResponse.json({ animals });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error scraping all animal data:', error.message);
    } else {
      console.error('An unknown error occurred while scraping all animal data');
    }
    return new Response('Error scraping all animal data', { status: 500 });
  }
}
