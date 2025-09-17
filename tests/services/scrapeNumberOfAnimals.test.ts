import axios from 'axios';
import { scrapeNumberOfAnimals } from '../../src/services/scrapeNumberOfAnimals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('scrapeNumberOfAnimals', () => {
  it('should return the number of animals when a valid HTML is provided', async () => {
    const mockHtml = `
      <html>
        <body>
          <span class="searchCountLabel">123 Found</span>
        </body>
      </html>
    `;
    mockedAxios.get.mockResolvedValue({ data: mockHtml });

    const numberOfAnimals = await scrapeNumberOfAnimals();
    expect(numberOfAnimals).toBe(123);
  });

  it('should return NaN when the element is not found', async () => {
    const mockHtml = `
      <html>
        <body>
          <span>Some other content</span>
        </body>
      </html>
    `;
    mockedAxios.get.mockResolvedValue({ data: mockHtml });

    const numberOfAnimals = await scrapeNumberOfAnimals();
    expect(numberOfAnimals).toBeNaN();
  });
});
