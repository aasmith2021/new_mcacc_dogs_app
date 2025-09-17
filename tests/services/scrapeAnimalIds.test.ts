import axios from 'axios';
import { scrapeAnimalIdBatch, scrapeAllAnimalIds } from '../../src/services/scrapeAnimalIds';
import { ANIMALS_PER_PAGE } from '../../src/services/utils';

const mockedAxiosGet = jest.spyOn(axios, 'get');

describe('scrapeAnimalIds', () => {
  afterEach(() => {
    mockedAxiosGet.mockClear();
  });

  describe('scrapeAnimalIdBatch', () => {
    it('should return a batch of animal ids', async () => {
      const mockHtml = `
        <html>
          <body>
            <li class="dogCard"><button id="Add_1"></button></li>
            <li class="dogCard"><button id="Add_2"></button></li>
            <li class="dogCard"><button id="Add_3"></button></li>
          </body>
        </html>
      `;
      mockedAxiosGet.mockResolvedValue({ data: mockHtml });

      const animalIds = await scrapeAnimalIdBatch(1);
      expect(animalIds).toEqual(['1', '2', '3']);
    });
  });

  describe('scrapeAllAnimalIds', () => {
    it('should return all animal ids from all pages', async () => {
      const mockHtmlPage1 = `
        <html>
          <body>
            <li class="dogCard"><button id="Add_1"></button></li>
            <li class="dogCard"><button id="Add_2"></button></li>
          </body>
        </html>
      `;
      const mockHtmlPage2 = `
        <html>
          <body>
            <li class="dogCard"><button id="Add_3"></button></li>
            <li class="dogCard"><button id="Add_4"></button></li>
          </body>
        </html>
      `;

      mockedAxiosGet
        .mockResolvedValueOnce({ data: mockHtmlPage1 })
        .mockResolvedValueOnce({ data: mockHtmlPage2 });

      const numberOfAnimals = ANIMALS_PER_PAGE + 1; // this will result in 2 pages
      const result = await scrapeAllAnimalIds(numberOfAnimals);

      // The test will call scrapeAnimalIdBatch for page 0 and 1
      expect(mockedAxiosGet).toHaveBeenCalledTimes(2);
      expect(result).toEqual(['1', '2', '3', '4']);
    });
  });
});
