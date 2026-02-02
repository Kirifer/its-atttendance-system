import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

console.log(
  "Postgres connected using:",
  process.env.DATABASE_URL ? "DATABASE_URL" : "Local Config"
);

export default pool;
