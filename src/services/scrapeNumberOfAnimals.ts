import axios from 'axios';
import * as cheerio from 'cheerio';
import { ANIMAL_IDS_BASE_URL, GET_OPTIONS } from './utils';

export const scrapeNumberOfAnimals = async () => {
  const response = await axios.get(`${ANIMAL_IDS_BASE_URL}1`, GET_OPTIONS);
  const html = response.data;
  const $ = cheerio.load(html);
  return parseInt($('span.searchCountLabel').text().trim().replace(' Found', ''), 10);
};
