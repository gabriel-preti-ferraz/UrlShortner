import express from "express"
const app = express()
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import client from "./db.js"
import {nanoid} from "nanoid"

app.use(express.json())
app.use(cors())
app.listen(process.env.API_PORT, () => console.log(`Server is running on PORT ${process.env.API_PORT}`))

app.post("/short", async (req, res) => {
    try {
        const { originalUrl } = req.body
        if (!originalUrl) {
            return res.status(400).json({ error: "Missing URL"})
        }

        const shortId = nanoid(6)
        const result = await client.query(
            "INSERT INTO urls (original_url, short_id) VALUES($1, $2) RETURNING short_id", 
            [originalUrl, shortId]
        )
        res.status(201).json({shortUrl: `${process.env.API_URL}:${process.env.API_PORT}/redirect/${result.rows[0].short_id}`})
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

app.get("/redirect/:shortId", async (req, res) => {
    try {
        const {shortId} = req.params
        const result = await client.query(
            "SELECT original_url, expires_at FROM urls WHERE short_id ILIKE $1",
            [shortId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({error: "Link does not exist"})
        } 

        const { original_url, expires_at } = result.rows[0]
        const now = new Date()

        if (expires_at && now > expires_at) {
            return res.status(410).json({error: "Link has expired"})
        }

        await client.query(
            "UPDATE urls SET clicks = clicks + 1 WHERE short_id ILIKE $1",
            [shortId]
        )

        res.redirect(original_url)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})