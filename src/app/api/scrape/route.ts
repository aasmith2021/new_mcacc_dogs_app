import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const url = 'https://apps.pets.maricopa.gov/adoptPets/Home/AnimalGrid?sizeFilter=1&ageFilter=1&genderFilter=1&animalId=&animalName=&kennelNum=&env=https%3A%2F%2Fapps.pets.maricopa.gov%2FadoptPets&fosterEligible=false&shelterFilter=All&animalTypeFilter=Dog&isLongTimer=false&isReadyToday=false&pageNumber=0';

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    const dogs: any[] = [];

    $('.dogCard').each((i, el) => {
      const name = $(el).find('.animalName').text().trim();
      const breed = $(el).find('.animalBreed').text().trim();
      const age = $(el).find('.animalAge').text().trim();
      const imageSrc = $(el).find('img').attr('src');

      if (name && imageSrc) {
        const image = imageSrc.startsWith('http') ? imageSrc : `https://apps.pets.maricopa.gov${imageSrc}`;
        dogs.push({
            name,
            breed,
            age,
            image
        });
      }
    });

    return NextResponse.json({ dogs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}
