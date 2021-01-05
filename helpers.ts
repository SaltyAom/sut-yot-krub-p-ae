import { Page } from "puppeteer-core"

export const second = (millisecond: number) => millisecond * 1000

export const delay = (time: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, second(time))
    })

export const findByText = (text: string, element = "span") =>
    `//${element}[text()='${text}']`

export const loginFacebook = async (
    page: Page,
    username: string,
    password: string
) => {
    await page.goto("https://www.facebook.com/login", {
        waitUntil: "networkidle2"
    })
    await page.$eval("#email", (element) => {
        let typedElement = element as HTMLInputElement

        typedElement.type = "password"
    })
    await page.type("#email", username)
    await page.type("#pass", password)

    await Promise.all([
        await page.click("#loginbutton"),
        await page.waitForNavigation()
    ])
}

export const shareDialog = `a[aria-label*="'s Timeline"]`

export const findShareDialog = async (page: Page) => {
    let shareButton = await page.$$(
        "div[aria-label='Send this to friends or post it on your timeline.']"
    )

    for (let shareOption of shareButton) {
        await shareOption.click()

        await page.waitForXPath(findByText("Share to News Feed"), {
            visible: true,
            timeout: second(5)
        })

        let [writePost] = await page.$x(findByText("Share to News Feed"))

        if (!writePost) continue

        writePost.click()
        break
    }

    await page.waitForSelector(shareDialog)
}
