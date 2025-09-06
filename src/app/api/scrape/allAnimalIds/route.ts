import { NextResponse, NextRequest } from 'next/server';
import { scrapeAllAnimalIds } from '../../../../services/scrapeAnimalIds';

export async function POST(request: NextRequest) {
  try {
    const numberOfAnimals = parseInt(await request.json(), 10);
    const animalIds = await scrapeAllAnimalIds(numberOfAnimals);
    return NextResponse.json({ animalIds });
  } catch (_error) {
    return new Response('Error scraping animal IDs', { status: 500 });
  }
}
