import { Pool } from "pg";
import { config } from "dotenv";
config();

export default new Pool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
