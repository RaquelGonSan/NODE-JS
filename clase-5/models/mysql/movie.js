import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "moviesdb",
};

const connectionString = process.env.DATABASE_URL ?? config;

const connection = await mysql.createConnection(connectionString);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      //get genre ids from database table using genre names
      const [genres] = await connection.query(
        "SELECT id, name FROM genre WHERE LOWER(name) = ?;",
        [lowerCaseGenre]
      );

      //no genre found
      if (genres.length === 0) {
        return [];
      }
      //get the id from the firs genre result
      const [{ id }] = genres;

      const [movies] = await connection.query(
        "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id = UUID_TO_BIN(?)",
        [id]
      );
      return movies;
    }

    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie"
    );
    return movies;
  }

  static async getById({ id }) {
    if (!id) {
      return [];
    }
    const [movie] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id = UUID_TO_BIN(?)",
      [id]
    );
    if (movie.length === 0) {
      return null;
    }
    return movie;
  }

  static async create({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      );
    } catch (e) {
      // puede enviarle información sensible
      throw new Error("Error creating movie");
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    );

    return movies[0];
  }

  static async delete({ id }) {
    if (!id) {
      return false;
    }
    const [result] = await connection.query(
      "DELETE FROM movie WHERE id = UUID_TO_BIN(?)",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async update({ id, input }) {
    if (!id) {
      return false;
    }
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [result] = await connection.query(
      `UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
        WHERE id = UUID_TO_BIN(?)`,
      [title, year, director, duration, poster, rate, id]
    );

    return result.affectedRows > 0;
  }
}
