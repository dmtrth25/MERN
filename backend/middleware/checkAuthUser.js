import jwt from "jsonwebtoken";

// функція вирішить чи можна повертати якусь секрутну інформацію чи ні
// нам необхідно спарсити токен і розшифрувати його

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
  // дістаємо з хедерів authorization
  // Якщо ж прийшов токен чи прийшов то передавати у разі рядок
  // За допомогою регулярки видали bearer і заміни його на порожню ''

  if (token) {
    // якщо token є ми його повинні розшифрувати
    try {
      const decoded = jwt.verify(token, 'pass321') // розшифровка передаємо сам токен і ключ за яким буде йти розшифрування цього токена

      // Якщо ми змогли розшифрувати токен
      req.userId = decoded._id
      next()
    } catch (error) {
      return res.status(403).json({
        message: 'Немає доступу'
      })
    }
  } else {
    return res.status(403).json({
      message: 'Немає доступу'
    })
  }
}