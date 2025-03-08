import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
      host: "10.68.32.129",
      database: "hackathon",
      password: "admin",
      port: "5432",
    });

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/learn", (req, res) => {
    res.render("learn.ejs");
})

app.get("/productivity", (req, res) => {
    res.render("productivity.ejs");
})

app.get("/health", (req, res) => {
    res.render("health.ejs");
})

app.get("/schedule", (req, res) => {
    res.render("schedule.ejs");
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
  