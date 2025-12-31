const apiUrl = "http://localhost:8080"

const input = document.getElementById('url')
const form = document.querySelector("form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const originalUrl = input.value
    if (!originalUrl) {
        alert("Type a valid URL")
        return
    }

    try {
        const response = await fetch(`${apiUrl}/short`, {
            method: "POST",
            body: JSON.stringify({ originalUrl: originalUrl }),
            headers: {"Content-Type": "application/json"}
        })
        
        const data = await response.json()
        alert(`Shortened URL: ${data.shortUrl}`)
    } catch (err) {
        console.log(err)
        alert("An error ocurred")
    }
})