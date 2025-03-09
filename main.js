import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;
const localIpaddr = "192.168.1.217"
const db = new pg.Client({
    user: "postgres",
      host: "192.168.1.206",
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

app.get("/register", (req, res) => {
    res.render("register.ejs");
})

app.post("/register", (req, res) => {
    const body = req.body;
    bcrypt.hash(body.password, saltRounds, async function(err, hash) {
            try {
                await db.query("INSERT INTO accounts VALUES ($1, $2)", [body.username, hash]);
                res.render("login.ejs")
            } catch (err) {
                console.log(err || "none")
                res.send("failed");
            }
        });
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

app.post("/schedule/streak-add/:username/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        await db.query("UPDATE todolist SET streak = streak + 1 WHERE id = $1", [id]);
        res.redirect(`/schedule/${req.params.username}`);
    } catch (err) {
        console.log(err);
    }
})
app.post("/schedule/streak-reset/:username/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        await db.query("UPDATE todolist SET streak = 0 WHERE id = $1", [id]);
        res.redirect(`/schedule/${req.params.username}`);
    } catch (err) {
        console.log(err);
    }
})

app.get("/schedule/:username", async (req, res) => {
    const username = req.params.username
    const items = await db.query(`SELECT item, streak, id FROM todolist WHERE username = $1 ORDER BY id`, [req.params.username])
    console.log(items.rows)
    res.render("schedule.ejs", {username: username, items: items.rows});
})
app.post("/schedule/:username/", async (req, res) => {
    const item = req.body.task;
  // items.push({title: item});
  try {
    await db.query("INSERT INTO todolist (item, username) VALUES ($1, $2)", [item, req.params.username]);
    res.redirect(`/schedule/${req.params.username}`);
  } catch (err) {
    console.log(err);
  }
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})
app.post("/login", async (req, res) => {
    const body = req.body;
        try {
            const user = await db.query("SELECT hash FROM accounts WHERE username = $1", [body.username])
            bcrypt.compare(body.hash, user.rows[0].hash, function(err, result) {
                if (result == true) {
                    res.render("login-success.ejs", {username: body.username});
                } else {
                    res.render("error.ejs")
                }
            });
        } catch(err) { 
            console.log(err)
            res.render("error.ejs")
        }
})

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
  