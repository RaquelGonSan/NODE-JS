const http = require('node:http')
const fs = require('node:fs')

const desirePort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  // console.log('peticion recibida: ', req.url)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  if (req.url === '/') {
    req.statusCode = 200
    res.end('<h2>Bienvenido a mi página de inicio</h2>')
  } else if (req.url === '/imagen') {
    console.log('Sirviendo imagen...')
    fs.readFile('./clase-2/cat.jpg', (error, data) => {
      if (error) {
        console.error('Error al leer la imagen:', error)
        res.statusCode = 500
        res.end('Internal server error')
      } else {
        res.setHeader('Content-Type', 'image/jpeg')
        res.statusCode = 200
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    req.statusCode = 200
    res.end('<h2>Bienvenido a mi página de contacto<h2>')
  } else {
    req.statusCode = 404
    res.end('Página no encontrada. Error 404')
  }
}

const server = http.createServer(processRequest)

server.listen(desirePort, () => {
  console.log(`servidor escuchando en el puerto http://localhost:${desirePort}`)
})
