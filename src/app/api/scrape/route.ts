import { NextResponse } from 'next/server';
import { scrapeAnimals } from '../../../services/scraper';

export async function GET() {
  try {
    const animals = await scrapeAnimals();
    return NextResponse.json({ animals });
  } catch (_error) {
    return new Response('Error scraping animals', { status: 500 });
  }
}
