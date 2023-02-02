import { validationResult } from 'express-validator'

export default (req, res, next) => {
  const errors = validationResult(req) // вміщуємо наш запит

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  } // якщо була помилка - валідація не пройшла далі запит не виконується

  next()
}