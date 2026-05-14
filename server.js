const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./database/db");


const SECRET = "BLACKCAT_SECRET_KEY";


const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

/* ADMIN LOGIN */
app.post("/api/login", (req, res) => {

    const {
        username,
        password
    } = req.body;

    const admin = db
    .prepare(`
        SELECT *
        FROM admins
        WHERE username = ?
    `)
    .get(username);

    if(!admin){

        return res.status(401).json({
            error: "Invalid username"
        });
    }

    const validPassword = bcrypt.compareSync(
        password,
        admin.password
    );

    if(!validPassword){

        return res.status(401).json({
            error: "Invalid password"
        });
    }

    const token = jwt.sign(
        {
            id: admin.id,
            username: admin.username
        },
        SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.json({
        success: true,
        token
    });
});

function authenticate(req, res, next){

    const authHeader = req.headers.authorization;

    if(!authHeader){

        return res.status(401).json({
            error: "Access denied"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const verified = jwt.verify(
            token,
            SECRET
        );

        req.user = verified;

        next();

    } catch(err){

        res.status(401).json({
            error: "Invalid token"
        });
    }
}

/* SAVE LEAD */
app.post("/api/leads", (req, res) => {

    try {

        const {
            name,
            email,
            company,
            message
        } = req.body;

        const stmt = db.prepare(`
            INSERT INTO leads (
                name,
                email,
                company,
                message
            )
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(
            name,
            email,
            company,
            message
        );

        res.json({
            success: true,
            message: "Lead saved successfully"
        });

    } catch(err){

        console.log(err.message);

        res.status(500).json({
            error: err.message
        });
    }
});

/* GET LEADS */
app.get("/api/leads", authenticate, (req, res) => {

    try {

        const stmt = db.prepare(`
            SELECT *
            FROM leads
            ORDER BY id DESC
        `);

        const rows = stmt.all();

        res.json(rows);

    } catch(err){

        res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});