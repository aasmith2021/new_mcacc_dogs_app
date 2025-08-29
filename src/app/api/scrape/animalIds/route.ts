import { NextResponse } from 'next/server';
import { scrapeAnimalIds } from '../../../../services/scrapeAnimalIds';

export async function GET() {
  try {
    const animalIds = await scrapeAnimalIds();
    return NextResponse.json({ animalIds });
  } catch (_error) {
    return new Response('Error scraping animal IDs', { status: 500 });
  }
}
