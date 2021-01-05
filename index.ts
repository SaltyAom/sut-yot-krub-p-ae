import puppeteer from "puppeteer-core"
import { getEdgePath } from "edge-paths"

import {
    findByText,
    findShareDialog,
    loginFacebook,
    shareDialog
} from "./helpers"

require("dotenv").config()

let สุดยอดครับพี่เอ้ = async () => {
    let browser = await puppeteer.launch({
            headless: false,
            executablePath: getEdgePath()
        }),
        page = await browser.newPage()

    // ? Disable popup
    browser
        .defaultBrowserContext()
        .overridePermissions("https://www.facebook.com", [])

    let { email, password, caption = "สุดยอดครับพี่เอ้" } = process.env as Record<string, string>
    await loginFacebook(page, email, password)

    await page.goto("https://www.facebook.com/suchatvee.ae", {
        waitUntil: "networkidle0"
    })

    await findShareDialog(page)

    let shareText: any = await page.evaluateHandle(() => document.activeElement)
    await shareText.type(caption)

    let [post] = await page.$x(findByText("Post"))
    post.click()

    await page.waitForSelector(shareDialog, { hidden: true })
    await browser.close()
}

สุดยอดครับพี่เอ้()
