const axios = require('axios').default
const cheerio = require('cheerio')

const fetchHtml = async url => {
    try {
        let res = await axios({
            url: url,
            method: 'get',
            timeout: 8000,
         })
        if(res.status == 200){
            console.log(res.status)
        }    
        return res.data
     }
    catch (err) {
        console.error(err);
    }
}

const extract = selector => {
    const title = selector
        .find('h2.ui-app-card__name')
        .text()
        .trim();

    const average = selector
        .find('span.ui-star-rating__rating')
        .text()
        .split(' ')[0]
        .trim();
        
    const total = selector
        .find('span.ui-review-count-summary')
        .text()
        .replace('(','')
        .replace(')','')
        .replace('reviews','')
        .trim();

    return { title, average, total }
}

const scrapeRev = async () => {
    const url = 'https://apps.shopify.com/search?q=review&sort_by=installed'

    const html = await fetchHtml(url)

    if (html) {
        const selector = cheerio.load(html)

        const card_selector = '.ui-app-card'

        const searchResults = selector("body").find(card_selector);
        const cards = searchResults.map((idx,el) => {
            const elementSelector = selector(el)
            return extract(elementSelector)
        })
        .get()
        return cards
    } else {
        console.log('not good')
    }
}

module.exports = scrapeRev;