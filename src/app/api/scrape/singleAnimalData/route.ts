import { NextResponse, NextRequest } from 'next/server';
import { scrapeSingleAnimalData } from '../../../../services/scrapeAnimalData';

export async function POST(request: NextRequest) {
  const animalId = await request.json();
  try {
    const singleAnimalData = await scrapeSingleAnimalData(animalId);
    return NextResponse.json({ singleAnimalData });
  } catch (_error) {
    return new Response(`Error scraping single animal data for animal with ID: ${animalId}`, { status: 500 });
  }
}
