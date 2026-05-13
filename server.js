const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./database/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

/* SAVE LEAD */
app.post("/api/leads", (req, res) => {

    const {
        name,
        email,
        company,
        message
    } = req.body;

    db.run(
        `
        INSERT INTO leads (
            name,
            email,
            company,
            message
        )
        VALUES (?, ?, ?, ?)
        `,
        [name, email, company, message],
        function(err){

            if(err){
                console.log(err.message);

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Lead saved successfully"
            });
        }
    );
});

/* GET LEADS */
app.get("/api/leads", (req, res) => {

    db.all(
        `
        SELECT * FROM leads
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});