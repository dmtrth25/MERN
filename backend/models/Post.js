import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    unique: true // унікальне
  },
  tags: {
    type: Array,
    default: [] // якщо ми не передаємо масив то по дефолту []
  },
  // в нашої статі буде ще кількість переглядів
  viewsCount: {
    type: Number,
    default: 0
  },
  // в будь-якій статті є свій автор
  user: {
    type: mongoose.Types.ObjectId, // це не просто строка ми повинні зберігаті id користувача
    ref: 'User', // ця модель буде посилатися на окрему модель User
    // ти повинен посилатися на цю ід в тайп в моделі юзера і звідти витягувати користувача
    // зв'язок між двума таблицями relationships
    required: true // обов'язково при створенні документу
  },
  imageUrl: String // якщо опційно то вкузуємо без {}
}, {
  timestamps: true // создание дата и обновление при создании нового usera этой схемы
})

export default mongoose.model('Post', PostSchema) // Post - название схемы