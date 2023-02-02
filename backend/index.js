import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import { checkAuthUser, handleError } from './middleware/index.js'
import { registerValidator, loginValidator, createPostValidator } from './validations.js'
import { UserController, PostController } from './controllers/index.js'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err))

const app = express()

// Створюємо сховище, де ми будемо зберігати зображення

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads') // null - не отримує ніяких помилок
    // uploads - папка де будуть зберігатися завантажені файли
  }, // де ми будемо зберігати зображення
  // destination очікує 3 параметри, але ми вкажемо лише cb та вказує який шлях використовувати
  filename: (_, file, cb) => { // file - беремо назву файлу, який буде передаватися при відпривці запиту
    cb(null, file.originalname) // null - не отримує ніяких помилок
    // file.originalname - ми хочемо витягнути оригінальну назву файлу
  }// Як буде називатися файл
}) // Коли буде любий файл завантажуватися будет виконуватися функція destination котра поверне шлях цього файлу
// Перед збереженням цього файлу функція filename пояснить як назвати цей файл

// тепер логіку повинну використати з express 

const upload = multer({ storage }) // тепер у multer є таке сховище

// Як пояснити express що э статична папка
// Якщо прийде запит на /uploads

// app.use('/uploads', express.static('uploads'))
app.use('/uploads', express.static('uploads')) // перевіряємо чи є в папці те, що ми передаємо
// пояснює що ми робимо get запит на отримання статичного файлу

app.use(cors())
app.use(express.json()) // express теперь может прочитать что храниться в запросе req ex. req.body

app.post('/auth/login', loginValidator, handleError, UserController.login) // Робимо валідацію, якщо помилки є то їх парсимо та повертаємо, якщо помилок немає тільки тоді виконаємо авторизацію
app.post('/auth/register', registerValidator, handleError, UserController.register) // те саме тільки на реєстрацію
app.get('/auth/me', checkAuthUser, UserController.checkUser)
// можем ли мы получить информацию о себе

app.post('/upload', checkAuthUser, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}` // повертаємо клієнту по якому url ми зберегли зображення
    // req.file.originalname - із запиту витягуємо файл та його оригінальну назву
    // якщо завантаження пройшло успішно після upload.single - скажемо клієнту - ось тобі посилання на картинку req.file.originalname
    // в req.file - буде зберігатися інформація про завантажене зображення за рахунок upload.single middleware
    // звичайно перевірка на авторизацію checkAuthUser

    // Insomnia - замість json - Multipart form 
    // name - image
    // value - file instead text
  })
}) // перед тим як виконати щось ми використаємо middleware multer - ми очікуємо файл під назвою image (image з якоюсь картинкою)
// якщо така картинка прийде тоді виконуємо нашу колбек

// не захищені роути (тобто отримати інформацію можуть всі)
app.get('/tags', PostController.getTags)
app.get('/posts', PostController.getAllPosts)
app.get('/posts/tags', PostController.getTags)
app.get('/posts/:id', PostController.getSinglePost)

// захищені роути (тобто тільки авторизованим користувачам є доступ)
app.post('/posts', checkAuthUser, createPostValidator, handleError, PostController.createPost) // checkAuthUser з початку перевір авторизацію користувача
app.patch('/posts/:id', checkAuthUser, handleError, PostController.updatePost)
app.delete('/posts/:id', checkAuthUser, PostController.removePost),

  app.listen(4444, (err) => {
    if (err) {
      console.log(err);
    }

    console.log('Server OK');
  })