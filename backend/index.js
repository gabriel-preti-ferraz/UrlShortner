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
            "INSERT INTO urls (original_url, short_url) VALUES($1, $2) RETURNING short_url", 
            [originalUrl, shortId]
        )
        res.status(201).json({shortUrl: `${process.env.SITE_URL}/${result.rows[0].short_url}`})
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

app.get("/redirect/:shortId", async (req, res) => {
    try {
        const {shortId} = req.params
        const result = await client.query(
            "SELECT original_url FROM urls WHERE short_url ILIKE $1",
            [shortId]
        )

        if (!result.rows) {
            return res.status(404).json({error: "Link does not exist"})
        }

        const originalUrl = result.rows[0].original_url
        res.redirect(originalUrl)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})