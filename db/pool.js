import { Pool } from "pg";
import { config } from "dotenv";
config();

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Railway için gerekli
        }
    })
    : new Pool({
        host: process.env.HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    });

export default pool;