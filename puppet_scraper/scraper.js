const puppeteer = require('puppeteer');
function scrape () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
            });
            const page = (await browser.pages())[0]
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            );
            await page.setViewport({
                width: 1920,
                height: 1080
            });
            console.log(`Scraper running...`)
            await page.goto("https://apps.shopify.com/search?q=review",{waitUntil: 'networkidle0'});
            // await page.waitForSelector('#SearchResultsListings');
            let data = await page.evaluate(() => {
                let results = [];
                let temp = document.querySelectorAll('.ui-app-card').length
                if (temp > 0) {
                    let cards = document.querySelectorAll('.ui-app-card');
                    cards.forEach((card) => {
                        results.push({
                            title:  card.querySelector('.ui-app-card__name')
                                        .textContent
                                        .replace('"','')
                                        .trim(),
                            average: card.querySelector('.ui-star-rating__rating')
                                        .textContent
                                        .split(' ')[0]
                                        .trim(),
                            total: card.querySelector('.ui-review-count-summary')
                                        .textContent
                                        .replace('(','')
                                        .replace(')','')
                                        .replace('reviews','')
                                        .trim()
                        });
                    })
                } else {
                    let cards = document.querySelectorAll('.ui-app-search-card');
                    cards.forEach((card) => {
                        results.push({
                            title:  card.querySelector('.ui-app-search-card__name')
                                        .textContent
                                        .replace('"','')
                                        .trim(),
                            average: card.querySelector('.ui-star-rating__rating')
                                        .textContent
                                        .split(' ')[0]
                                        .trim(),
                            total: card.querySelector('.ui-review-count-summary')
                                        .textContent
                                        .replace('(','')
                                        .replace(')','')
                                        .replace('reviews','')
                                        .trim()
                        });
                    })
                }
                return results;
            })
            // browser.close();

            return resolve(data);
        } catch (e) {
            return reject(e);
        }
    })
}

scrape().then(console.log)
// module.exports = scrape()