import { NextResponse } from 'next/server';
import { scrapeNumberOfAnimals } from '@/services/scrapeNumberOfAnimals';

export async function GET() {
  try {
    const numberOfAnimals = await scrapeNumberOfAnimals();
    return NextResponse.json({ numberOfAnimals });
  } catch (_error) {
    return new Response('Error scraping number of animals', { status: 500 });
  }
}
