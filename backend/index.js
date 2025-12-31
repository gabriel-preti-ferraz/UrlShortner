import express from "express"
const app = express()
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import client from "./db.js"

app.use(express.json())
app.use(cors())
app.listen(process.env.API_PORT, () => console.log(`Server is running on ${process.env.API_URL}:${process.env.API_PORT}`))

app.post("/short", async (req, res) => {
    try {
        const { originalUrl } = req.body
        const shortId = Math.random().toString(36).substring(2, 8)
        const result = await client.query(
            "INSERT INTO urls (original_url, short_url) VALUES($1, $2) RETURNING short_url", [originalUrl, shortId]
        )
        res.status(201).json(result.rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})