const puppeteer = require('puppeteer');

async function scrapeGrades(username, password) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Go to the Coppell ISD HAC login page
    await page.goto('https://hac.coppellisd.com/HomeAccess/Account/LogOn');

    // Wait for the login form to load
    await page.waitForSelector('#UserName');

    // Type in the username and password
    await page.type('#UserName', username);
    await page.type('#Password', password);

    // Submit the form (login)
    await Promise.all([
        page.click('#loginButton'),  // button to submit
        page.waitForNavigation({ waitUntil: 'networkidle0' }),  // wait for the page to load after login
    ]);

    // After login, scrape the grades
    const grades = await page.evaluate(() => {
        const gradeElements = document.querySelectorAll('.gradeColumn');  // Adjust the selector if necessary
        const gradeList = [];
        gradeElements.forEach(element => {
            const subject = element.querySelector('.subject').textContent.trim();
            const grade = element.querySelector('.grade').textContent.trim();
            gradeList.push({ subject, grade });
        });
        return gradeList;
    });

    await browser.close();
    return grades;
}

module.exports = scrapeGrades;
