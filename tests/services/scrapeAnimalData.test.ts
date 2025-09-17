import axios from 'axios';
import { scrapeSingleAnimalData, scrapeAllAnimalData } from '../../src/services/scrapeAnimalData';
import { Animal } from '../../src/types';

const mockedAxiosGet = jest.spyOn(axios, 'get');

describe('scrapeAnimalData', () => {
  afterEach(() => {
    mockedAxiosGet.mockClear();
  });

  describe('scrapeSingleAnimalData', () => {
    it('should return animal data for a single animal', async () => {
      const mockHtml = `
        <html>
          <body>
            <div class="basicPetInfo">
              <img src="test_image.jpg" />
            </div>
            <div class="petInfoModal">
              <div class="detailInfoBox">Name: Test Dog</div>
              <div class="detailInfoBox">Breed: Test Breed</div>
              <div class="detailInfoBox">Age: 2 years</div>
              <div class="detailInfoBox">Sex: Male</div>
              <div class="detailInfoBox">Weight: 50 lbs</div>
              <div class="detailInfoBox">Arrived: 2023-01-01</div>
              <div class="detailInfoBox">Location: Shelter A</div>
              <div class="detailInfoBox">Level: 1</div>
              <div class="detailInfoBox">Adoption fee: $100</div>
            </div>
          </body>
        </html>
      `;
      mockedAxiosGet.mockResolvedValue({ data: mockHtml });

      const animalData = await scrapeSingleAnimalData('123');
      const expectedData: Animal = {
        id: '123',
        name: 'Test Dog',
        breed: 'Test Breed',
        age: '2 years',
        gender: 'Male',
        weight: '50 lbs',
        arrivalDate: '2023-01-01',
        location: 'Shelter A',
        level: '1',
        adoptionFee: '$100',
        image: 'test_image.jpg',
      };
      expect(animalData.id).toEqual(expectedData.id);
      expect(animalData.name).toEqual(expectedData.name);
      expect(animalData.breed).toEqual(expectedData.breed);
      expect(animalData.age).toEqual(expectedData.age);
      expect(animalData.gender).toEqual(expectedData.gender);
      expect(animalData.weight).toEqual(expectedData.weight);
      expect(animalData.arrivalDate).toEqual(expectedData.arrivalDate);
      expect(animalData.location).toEqual(expectedData.location);
      expect(animalData.level).toEqual(expectedData.level);
      expect(animalData.adoptionFee).toEqual(expectedData.adoptionFee);
      expect(animalData.image).toEqual(expectedData.image);
    });
  });

  describe('scrapeAllAnimalData', () => {
    it('should return all animal data for a list of ids', async () => {
      const mockHtml1 = `
        <html><body>
          <div class="basicPetInfo"><img src="img1.jpg" /></div>
          <div class="petInfoModal">
            <div class="detailInfoBox">Name: Dog1</div>
          </div>
        </body></html>
      `;
      const mockHtml2 = `
        <html><body>
          <div class="basicPetInfo"><img src="img2.jpg" /></div>
          <div class="petInfoModal">
            <div class="detailInfoBox">Name: Dog2</div>
          </div>
        </body></html>
      `;
      mockedAxiosGet
        .mockResolvedValueOnce({ data: mockHtml1 })
        .mockResolvedValueOnce({ data: mockHtml2 });

      const result = await scrapeAllAnimalData(['1', '2']);
      expect(mockedAxiosGet).toHaveBeenCalledTimes(2);
      expect(result[0].name).toBe('Dog1');
      expect(result[1].name).toBe('Dog2');
    });
  });
});
