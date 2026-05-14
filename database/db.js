const Database = require("better-sqlite3");

const db = new Database("leads.db");

console.log("✅ Leads Database Connected");

/* CREATE TABLE */
db.prepare(`
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        company TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

/* ADMIN TABLE */
db.prepare(`
    CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`).run();

const bcrypt = require("bcryptjs");

const adminExists = db
.prepare("SELECT * FROM admins WHERE username = ?")
.get("admin");

if(!adminExists){

    const hashedPassword = bcrypt.hashSync("admin123", 10);

    db.prepare(`
        INSERT INTO admins (
            username,
            password
        )
        VALUES (?, ?)
    `).run(
        "admin",
        hashedPassword
    );

    console.log("✅ Default admin created");
}

module.exports = db;