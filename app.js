const express = require('express')
const app = express()
const port = 5500
app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => {
  console.log(`Bot erstellt am Port ${port}`)
  console.log(`http://localhost:${port}`)
})