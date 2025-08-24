import { NextResponse } from 'next/server';
import { scrapeAnimals } from '../../../services/scraper';

export async function GET() {
  try {
    const animals = await scrapeAnimals();
    const scrapedAt = new Date().toISOString();
    return NextResponse.json({ animals, scrapedAt });
  } catch (_error) {
    return new Response('Error scraping animals', { status: 500 });
  }
}
