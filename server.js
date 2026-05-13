const express = require("express");
const cors = require("cors");

const db = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

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
app.get("/api/leads", (req, res) => {

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