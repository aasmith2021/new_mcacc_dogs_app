import axios from 'axios';
import * as cheerio from 'cheerio';
import { ANIMAL_IDS_BASE_URL, ANIMALS_PER_PAGE, GET_OPTIONS } from './utils';

export const scrapeAnimalIdBatch = async (pageNumber: number) => {
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

export const scrapeAllAnimalIds = async (numberOfAnimals: number) => {
  const numberOfPages = Math.ceil(numberOfAnimals / ANIMALS_PER_PAGE);
  
  const animalIds: string[] = [];
  const pageNumbers = Array(numberOfPages).fill('').map((_, index) => index);

  try {
    const batchIdFetchResults = await Promise.allSettled(
      pageNumbers.map((pageNumber) => scrapeAnimalIdBatch(pageNumber))
    );

    batchIdFetchResults.forEach((batchIdFetchResult) => {
      if (batchIdFetchResult.status === 'fulfilled') {
        animalIds.push(...batchIdFetchResult.value);
      }
    });
  } catch (error) {
    console.error('Error scraping animal IDs', error);
  }

  return animalIds;
};
