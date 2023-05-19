const express = require('express')
const app = express()

const router = require('./controllers/routes')

const PORT = 4004

app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`)
})