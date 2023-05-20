const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT
const router = require('./controllers/routes')


app.use(express.json())
app.use(router)

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`)
})