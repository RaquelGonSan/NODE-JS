const http = require('node:http')

const dittoJSON = require('./pokemon/ditto.json')

const desirePort = process.env.PORT ?? 3000
const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/JSON; charset=utf-8')
          return res.end(JSON.stringify(dittoJSON))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('Página no encontrada. Error 404')
      }
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const data = JSON.parse(body)
            res.writeHeader(201, { 'Content-Type': 'application/json, charset=utf-8 ' })
            res.end(JSON.stringify(data))
          })
          break
        }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('Página no encontrada. Error 404')
      }
  }
}

const server = http.createServer(processRequest)

server.listen(desirePort, () => {
  console.log(`servidor escuchando en el puerto http://localhost:${desirePort}`)
})
