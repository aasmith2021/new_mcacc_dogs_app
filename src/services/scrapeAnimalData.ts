import { chunk } from 'lodash';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Animal } from '../types';
import { ANIMAL_DATA_PAGE_BASE_URL, CHUNK_SIZE, GET_OPTIONS } from './utils';

export const scrapeSingleAnimalData = async (id: string): Promise<Animal> => {
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
  };

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
  const animalIdBatches: string[][] = chunk(allAnimalIds, CHUNK_SIZE);

  for (const animalIdBatch of animalIdBatches) {
    const animalDataBatchFetchResults = await Promise.allSettled(animalIdBatch.map(scrapeSingleAnimalData));

    animalDataBatchFetchResults.forEach((animalDataFetchResult) => {
      if (animalDataFetchResult.status === 'fulfilled') {
        allAnimalData.push(animalDataFetchResult.value);
      }
    });
  }

  return allAnimalData;
};
