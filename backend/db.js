import { Client } from "pg"
import dotenv from "dotenv"
dotenv.config({path: "./.env"})

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
})

client.connect().then(() => console.log("Database connected"))

export default client