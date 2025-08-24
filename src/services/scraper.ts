import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://apps.pets.maricopa.gov/adoptPets/Home/AnimalGrid?sizeFilter=1&ageFilter=1&genderFilter=1&pageNumber=0&animalId=&animalName=&kennelNum=&env=https%3A%2F%2Fapps.pets.maricopa.gov%2FadoptPets&fosterEligible=false&shelterFilter=All&animalTypeFilter=All&isLongTimer=false&isReadyToday=false&breedFilter=Any%20Breed';

interface Animal {
  name: string;
  id: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  image: string;
}

export const scrapeAnimals = async (): Promise<Animal[]> => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });
    const animals: Animal[] = [];

    // The response is a JSON object with an 'html' property.
    const html = response.data;
    console.log(html);
    const $ = cheerio.load(html);

    $('.card.h-100').each((_i, el) => {
      const name = $(el).find('h3 b').text().trim();
      const id = $(el).find('p.card-text').first().text().trim().replace('Animal ID: ', '');
      const breed = $(el).find('p.card-text').eq(1).text().trim().replace('Breed: ', '');
      const age = $(el).find('p.card-text').eq(2).text().trim().replace('Age: ', '');
      const gender = $(el).find('p.card-text').eq(3).text().trim().replace('Gender: ', '');
      const location = $(el).find('p.card-text').eq(4).text().trim().replace('Kennel: ', '');
      const image = $(el).find('.animal-image-link img').attr('src') || '';

      if (name) {
        animals.push({ name, id, breed, age, gender, location, image });
      }
    });

    return animals;
  } catch (error) {
    console.error('Error scraping animals:', error);
    return [];
  }
};
