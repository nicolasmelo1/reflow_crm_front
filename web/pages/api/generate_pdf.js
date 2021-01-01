const puppeteer = require('puppeteer')

let browsers = 0
const maximumNumberOfBrowsers = 10

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (browsers <= maximumNumberOfBrowsers) {
            browsers ++

            const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] })
            const page = await browser.newPage()
            await page.setContent(req.body.html, {waitUntil: 'networkidle0'})
            const pdf = await page.pdf({ format: 'A4' })
            
            await browser.close()
            browsers --
            res.setHeader('Content-Type', 'application/pdf')
            res.status(200).send(pdf)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({
                status: 'error',
                reason: 'too_much_to_handle'
            })
        }
    }
  }