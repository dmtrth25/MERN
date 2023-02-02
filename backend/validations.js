import { body } from 'express-validator'

// Валідація на логування
export const loginValidator = [
  body('email').isEmail(), // если емейл корректен - то пропускаем
  body('password', 'Password must have min 5 letters').isLength({ min: 5 }), // пароль минимум 5 символов
]

// Валідація на реєстрацію
export const registerValidator = [
  body('email').isEmail(), // если емейл корректен - то пропускаем
  body('password', 'Password must have min 5 letters').isLength({ min: 5 }), // пароль минимум 5 символов
  body('fullName').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL() // опционально и проверить ссылка ли это
]

// Валідація на статті
export const createPostValidator = [
  body('title', 'Введіть заголовок статті').isLength({ min: 3 }).isString(), // мінімум 3 символи та повинна бути строчка
  body('text', 'Введіть текст статті').isLength({ min: 5 }).isString(),
  body('tags', 'Невірний формат тегів').optional().isString(), // опційно
  body('imageUrl', 'Невірне посилання на зображення').optional().isString() // опційно та обов‘язково строчка
]