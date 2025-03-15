const z = require('zod')
const movieSchema = z.object({
  title: z.string({
    required_error: 'El titulo es requerido',
    invalid_type_error: 'El titulo debe ser un string'
  }),
  year: z.number().int().positive().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).optional(),
  poster: z.string().url({
    message: 'El poster debe ser una URL válida'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Fantasy', 'Scy-Fi', 'Crime']),
    {
      required_error: 'El género es requerido',
      invalid_type_error: 'El género debe ser un array de enum Genre'
    }
  )
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
