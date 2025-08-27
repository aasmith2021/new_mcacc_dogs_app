import axios from 'axios';
import * as cheerio from 'cheerio';
import { Animal } from '../app/types'

const ANIMAL_IDS_BASE_URL = 'https://apps.pets.maricopa.gov/adoptPets/Home/AnimalGrid?sizeFilter=1&ageFilter=1&genderFilter=1&pageNumber=';
const ANIMAL_DATA_PAGE_BASE_URL = 'https://apps.pets.maricopa.gov/adoptPets/Home/Details/';
const GET_OPTIONS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  },
};

export const fetchAnimalIdBatch = async (pageNumber: number) => {
  console.log(`Fetching Animal IDs Batch #${pageNumber + 1}`);
  const animalIdsBatch: string[] = [];
  const url = `${ANIMAL_IDS_BASE_URL}${pageNumber}`;
  const response = await axios.get(url, GET_OPTIONS);
  const html = response.data;
  const $ = cheerio.load(html);

  $('li.dogCard').each((_i, el) => {
    const id = $(el).find('button').first().attr().id.replace('Add_', '').trim();
    animalIdsBatch.push(id);
  });

  return animalIdsBatch;
};

export const scrapeAnimalIds = async () => {
  const animalIds: string[] = [];
  let pageNumber = 0;
  let standardBatchLength: number | null = null;
  let isNextPage = true;

  while (isNextPage) {
    try {
      const batchIds = await fetchAnimalIdBatch(pageNumber);
      animalIds.push(...batchIds);

      if (standardBatchLength === null) {
        standardBatchLength = batchIds.length;
      }

      // For testing, only fetch one page of data
      // TODO: remove next line and uncomment following code after testing
      isNextPage = false;
      // if (batchIds.length < standardBatchLength) {
      //   isNextPage = false;
      // }

      pageNumber += 1;
    } catch (error) {
      console.error('Error scraping animal IDs', error);
    }
  }

  return animalIds;
};

export const scrapeSingleAnimalData = async (id: string): Promise<Animal> => {
  console.log(`Fetching Animal Data for ID #${id}`);
  const url = `${ANIMAL_DATA_PAGE_BASE_URL}${id}`;
  const response = await axios.get(url, GET_OPTIONS);
  const html = response.data;
  const $ = cheerio.load(html);

  const animalData: Animal = {
    id,
    name: '',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    arrivalDate: '',
    location: '',
    level: '',
    adoptionFee: '',
    image: '',
  }

  animalData.image = $('div.basicPetInfo img').attr().src;

  $('div.petInfoModal div.detailInfoBox').each((_i, el) => {
    const [key, value]: string[] = $(el).text()
      .replace(/\n| /g, ':') // replace new lines and spaces with colons
      .replace(/:+/g, ':') // collapse multiple colons into one
      .replace(/^:|:$/g, '') // Remove leading and trailing colons
      .replaceAll(':', ' ') // convert all colons to spaces
      .replace(' ', ':') // convert the first space to a colon
      .replace('Animal:ID ', 'animal_id:') // update Animal_id key
      .replace('Adoption:fee ', 'adoption_fee:') // update Adoption_fee key
      .split(':');

    switch (key.toLowerCase()) {
      case 'name':
        animalData.name = value;
        break;
      case 'breed':
        animalData.breed = value;
        break;
      case 'age':
        animalData.age = value;
        break;
      case 'sex':
        animalData.gender = value;
        break;
      case 'weight':
        animalData.weight = value;
        break;
      case 'arrived':
        animalData.arrivalDate = value;
        break;
      case 'location':
        animalData.location = value;
        break;
      case 'level':
        animalData.level = value;
        break;
      case 'adoption_fee':
        animalData.adoptionFee = value;
        break;
      default:
    }
  });

  return animalData;
};

export const scrapeAllAnimalData = async (allAnimalIds: string[]) => {
  const allAnimalData: Animal[] = [];

  for (const animalId of allAnimalIds) {
    allAnimalData.push(await scrapeSingleAnimalData(animalId));
  }

  return allAnimalData
};

export const scrapeAnimals = async () => {
  const allAnimalIds = await scrapeAnimalIds();
  // For testing, only get data for first 3 animals
  // TODO: Remove .slice(0,3) after testing
  return scrapeAllAnimalData(allAnimalIds.slice(0,3));
}
