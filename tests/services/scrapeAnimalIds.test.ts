import axios from 'axios';
import { scrapeAnimalIdBatch, scrapeAllAnimalIds } from '../../src/services/scrapeAnimalIds';
import { ANIMALS_PER_PAGE } from '../../src/services/utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('scrapeAnimalIds', () => {
  afterEach(() => {
    mockedAxios.get.mockClear();
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
      mockedAxios.get.mockResolvedValue({ data: mockHtml });

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

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockHtmlPage1 })
        .mockResolvedValueOnce({ data: mockHtmlPage2 });

      const numberOfAnimals = ANIMALS_PER_PAGE + 1; // this will result in 2 pages
      const result = await scrapeAllAnimalIds(numberOfAnimals);

      // The test will call scrapeAnimalIdBatch for page 0 and 1
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual(['1', '2', '3', '4']);
    });
  });
});
