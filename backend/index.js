import express from "express"
const app = express()
import dotenv from "dotenv"
dotenv.config({path: "./.env"})

app.use(express.json())
app.use(cors())
app.listen(process.API_PORT, () => console.log(`Server is running on ${process.API_URL}:${process.API_PORT}`))