// A more specific mock for cheerio
const cheerioMock = {
  load: (html) => {
    const $ = (selector) => {
      if (typeof selector === 'object') {
        // This is the case where we get an element from `each`
        return selector;
      }

      if (selector === 'span.searchCountLabel') {
        const match = html.match(/<span class="searchCountLabel">([^<]+)<\/span>/);
        return {
          text: () => match ? match[1] : '',
        };
      }
      if (selector === 'li.dogCard') {
        const elements = [];
        const matches = html.matchAll(/<li class="dogCard">([\s\S]*?)<\/li>/g);
        for (const match of matches) {
            const buttonIdMatch = match[1].match(/<button id="([^"]+)"/);
            elements.push({
                find: (findSelector) => {
                    if (findSelector === 'button') {
                        return {
                            first: () => ({
                                attr: () => ({ id: buttonIdMatch ? buttonIdMatch[1] : '' })
                            })
                        }
                    }
                    return { first: () => ({ attr: () => ({}) }) };
                }
            });
        }
        return {
          each: (callback) => {
            elements.forEach((el, i) => callback(i, el));
          },
        };
      }
      if (selector === 'div.basicPetInfo img') {
          const match = html.match(/<img src="([^"]+)"/);
          return {
              attr: () => ({ src: match ? match[1] : '' })
          };
      }
      if (selector === 'div.petInfoModal div.detailInfoBox') {
          const elements = [];
          const matches = html.matchAll(/<div class="detailInfoBox">([^<]+)<\/div>/g);
          for (const match of matches) {
              elements.push({
                  text: () => match[1]
              });
          }
          return {
              each: (callback) => {
                  elements.forEach((el, i) => callback(i, el));
              }
          };
      }
      return {
        text: () => '',
        each: () => {},
        attr: () => ({}),
        find: () => ({ first: () => ({ attr: () => ({}) }) }),
      };
    };
    return $;
  },
};

module.exports = cheerioMock;
