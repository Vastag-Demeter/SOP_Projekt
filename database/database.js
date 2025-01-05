import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "yourdatabase",
  });

  console.log("Successfully connected to database!");
} catch (err) {
  console.log(`Error: ${err}`);
}

export default pool;
