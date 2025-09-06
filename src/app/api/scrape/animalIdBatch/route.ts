import { NextResponse, NextRequest } from 'next/server';
import { scrapeAnimalIdBatch } from '../../../../services/scrapeAnimalIds';

export async function POST(request: NextRequest) {
  const pageNumber = await request.json();
  try {
    const animalIds = await scrapeAnimalIdBatch(pageNumber);
    return NextResponse.json({ animalIds });
  } catch (_error) {
    return new Response(`Error scraping animal ID batch for pageNumber: ${pageNumber}`, { status: 500 });
  }
}
