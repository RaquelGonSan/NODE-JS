import express, { json } from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";

//como leer un JSON en ESModules
//import fs from 'node:fs'
//const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

//Como leer un json en ESModules
//import { createRequire } from 'node:module'
//const require = createRequire(import.meta.url)
//const movies = require('./movies.json')

//Como leer un json en ESModules recomendado

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable("x-powered-by");

app.use("/movies", moviesRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto http://localhost:${PORT}`);
});
