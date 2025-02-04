import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "2057",
  database: "prueba2",
});

export default pool;