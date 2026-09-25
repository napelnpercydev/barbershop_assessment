import mysql from "mysql2";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.AIVEN_DB_HOST,
  user: process.env.AIVEN_DB_USER,
  password: process.env.AIVEN_DB_PASS,
  database: process.env.AIVEN_DB_NAME,
  port: Number(process.env.AIVEN_DB_PORT),

  ssl: {
    ca: fs.readFileSync(path.resolve(__dirname, "ca.pem")),
  },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("MySQL Pool Connected to Aiven");
  connection.release();
});

export default db;