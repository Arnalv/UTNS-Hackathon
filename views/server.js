const express = require('express');
const scrapeGrades = require('./scraper');  // Import the scraper script

const app = express();
const port = 3000;

// Endpoint to get grades
app.get('/grades', async (req, res) => {
    const { username, password } = req.query;  // Get username and password from query parameters
    
    try {
        const grades = await scrapeGrades(username, password);
        res.json(grades);  // Return the grades as a JSON response
    } catch (error) {
        res.status(500).send('Error scraping grades');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
