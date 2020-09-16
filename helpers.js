const delay = (time) =>
    new Promise((resolve) => {
        setTimeout(resolve, time * 1000)
    })

const findByText = (text, element = "span") => `//${element}[text()='${text}']`

const loginFacebook = (page, username, password) =>
    new Promise(async (resolve) => {
        await page.goto("https://www.facebook.com/login", {
            waitUntil: "networkidle2"
        })
        await page.$eval("#email", (el) => (el.type = "password"))
        await page.type("#email", username, { delay: 30 })
        await page.type("#pass", password, { delay: 30 })
        await page.click("#loginbutton")

        resolve()
    })

module.exports = {
    delay,
    findByText,
    loginFacebook
}
