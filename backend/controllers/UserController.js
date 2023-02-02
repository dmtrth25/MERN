import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserSchema from '../models/User.js'

export const register = async (req, res) => {
  try {
    const password = req.body.password // дістаємо пароль
    const salt = await bcrypt.genSalt(10) // генеруємо соль
    const hash = await bcrypt.hash(password, salt) // шифруємо наш пароль

    const doc = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash
    })

    const user = await doc.save() // зберігаємо користувачів в бд

    // після того як зберегли користувача в бд - створимо токен
    const token = jwt.sign({
      _id: user._id // id вистачить для перевірки користувача
    },
      'pass321', // другим параметром іде ключ завдяки якому ми шифруємо токен
      {
        expiresIn: '30d' // третій параметр скільки годин, часу зберігатиметься токен (термін життя токена) перестане бути валідним через 30 днів
      }) // створити токен. токен зберігатиме зашифровану інформацію

    const { passwordHash, ...data } = user._doc // витягуємо хеш пароль та все інше
    res.json({
      ...data, // хочемо повернути інформацію про користувача та сам token (без пароля)
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося зареєструватися"
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email }) // знаходимо користувача

    if (!user) { // перевірка чи є він у бд
      return res.status(404).json({
        message: 'Користувач не знайдений'
      })
    }

    // порівнюємо паролі
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    // якщо значення не вірні
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Login or password incorrect' // хоча ми перевіряємо лише пароль, вкажемо так
      })
    }

    // якщо пароль минув ми створюємо новий токен
    const token = jwt.sign({
      _id: user._id // id вистачить для перевірки користувача
    },
      'pass321', // другим параметром іде ключ завдяки якому ми шифруємо токен
      {
        expiresIn: '30d' // третій параметр скільки годин, часу зберігатиметься токен (термін життя токена) перестане бути валідним через 30 днів
      }) // створити токен - наш токен зберігатиме зашифровану інформацію

    const { passwordHash, ...data } = user._doc // витягуємо хеш пароль та все інше

    res.json({
      ...data, // ми хочемо повернути інформацію про користувача та сам token (без пароля)
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не вдалося авторизуватися'
    })
  }
}

export const checkUser = async (req, res) => { // вказуємо функцію перевірки - буде undefined тому що потрібно викликати функції next() тільки тоді отримаємо наш json success
  try {
    const user = await UserSchema.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'Користувача не знайдено'
      })
    }

    const { passwordHash, ...data } = user._doc // витягуємо хеш пароль та все інше

    res.json(data)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нема доступу"
    })
  }
}