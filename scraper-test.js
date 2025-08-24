const { scrapeAnimals } = require('./src/services/scraper.ts');

async function run() {
  const animals = await scrapeAnimals();
  console.log(animals);
}

run();
