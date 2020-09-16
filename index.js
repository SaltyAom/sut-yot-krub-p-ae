const puppeteer = require("puppeteer-core")
const { getEdgePath } = require("edge-paths")

const { delay, findByText, loginFacebook } = require("./helpers")

require('dotenv').config()

;(async () => {
    let browser = await puppeteer.launch({
        headless: false,
        executablePath: getEdgePath()
    }),
        page = await browser.newPage()

    // Disable popup
    let context = browser.defaultBrowserContext()
    context.overridePermissions("https://www.facebook.com", [])

    let { email, password } = process.env
    await loginFacebook(page, email, password)

    await delay(3)

    await page.goto("https://www.facebook.com/suchatvee.ae")

    await delay(1)

    let shareButton = await page.$$(
        "div[aria-label='Send this to friends or post it on your timeline.']"
    )

    for (let shareOption of shareButton) {
        await shareOption.click()

        await delay(2)

        let [writePost] = await page.$x(findByText("Share to News Feed"))

        // Find more share button.
        await page.$$("div[aria-label='Share to News Feed']")

        if (!writePost) continue

        writePost.click()
        break
    }

    await delay(1)

    let shareText = await page.evaluateHandle(() => document.activeElement)
    await shareText.type("สุดยอดครับพี่เอ้")

    await delay(1)

    let [post] = await page.$x(findByText("Post", "div"))
    post.click()

    await delay(2)

    await browser.close()
})()