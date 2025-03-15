const PORT = process.env.PORT ?? 3000
const dittoJSON = require('./pokemon/ditto.json')
const express = require('express')
const app = express()
app.disable('x-powered-by')

app.use(express.json())
/*
app.use((req, res, next) => {
  console.log('middleware')
  if (req.method !== 'POST') {
    return next()
  }
  if (req.headers['content-type'] !== 'application/json') {
    return next()
  }
  // solo llegan request que son POST y que tienen Content-Type: application/json
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    // mutar la request y meter la info en el req.body
    req.body = data
    next()
  })
})
*/
app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

// la ultima a la que va a llegar
app.use((req, res) => {
  res.status(404).send('Página no encontrada. Error 404')
})

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto http://localhost:${PORT}`)
})
