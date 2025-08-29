import { NextResponse, NextRequest } from 'next/server';
import { scrapeAllAnimalData } from '../../../../services/scrapeAnimalData';

const animalDataFetchPercentage = 0;

export async function POST(request: NextRequest) {
  try {
    const allAnimalIds = await request.json();
    const animals = await scrapeAllAnimalData(allAnimalIds);

    return NextResponse.json({ animals });
  } catch (_error) {
    return new Response('Error scraping animal data', { status: 500 });
  }
}
