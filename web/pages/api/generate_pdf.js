const puppeteer = require('puppeteer')

let browsers = 0
const maximumNumberOfBrowsers = 20

// This is why we use NEXT.js (and love it). By using this we can run puppeteer on the node backend of 
// the next.js aplication without needing to touch our real backend. With puppeteer we can get a web 
// page and generate a pdf from it. With this everything becomes slick and concise.
export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (browsers <= maximumNumberOfBrowsers) {
            browsers ++

            try {
                const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox'] })
                const page = await browser.newPage()

                await page.setDefaultNavigationTimeout(90000)
                await page.setContent(req.body.html, {waitUntil: 'networkidle0'})
                await page.emulateMediaType('screen')
                
                const pdf = await page.pdf({
                    width:'794px', height: '1123px',
                    margin: {
                        top: '35px',
                        left: '35px',
                        right: '35px',
                        bottom: '35px'
                    }
                })
                await browser.close()
                browsers --
                res.setHeader('Content-Type', 'application/pdf')
                res.status(200).send(pdf)
            } catch (e) {
                console.log('[ERROR IN PDF GENERATION]')
                console.log(e)
                browsers --
                res.setHeader('Content-Type', 'application/json')
                res.status(400).json({
                    status: 'error',
                    reason: 'unexpected'
                })
            }   
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(400).json({
                status: 'error',
                reason: 'too_much_to_handle'
            })
        }
    }
  }