const express = require('express')
const bodyParser = require('body-parser')
const R = require('ramda')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())

app.post('/clinc-bizlo', (req, res) => {
})

app.listen(port, () => console.log(`Clinc bizlo server is istening on port ${port}!`))
