import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // унікальне
  },
  passwordHash: {
    type: String,
    required: true // необхідно
  },
  avatarUrl: String // якщо не обов'язкове поле, то вказуємо без {}
}, {
  timestamps: true // створення дата та оновлення при створенні нового usera цієї схеми
})

export default mongoose.model('User', UserSchema) // User - назва схеми