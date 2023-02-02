import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts') // витягуємо data
  return data
})
// Тепер необхідно відправити цей запит на бекенд

export const fetchRemovePosts = createAsyncThunk('posts/fetchRemovePosts', async (id) => {
  axios.delete(`/posts/${id}`) // скорочуємо бо data відповідь нам не обов'язкова
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags')
  return data
})

const initialState = {
  posts: {
    items: [],
    status: 'Loading'
  },
  tags: {
    items: [],
    status: 'Loading'
  },
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}, // тут будуть методи, які будуть дозволяти оновлювати наш стейт
  extraReducers: {
    // Отримання статей
    [fetchPosts.pending]: (state) => { // коли завантаження
      state.posts.items = [] // скидання елементів (сброс)
      state.posts.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => { // коли успішне завершення
      state.posts.items = action.payload
      state.posts.status = 'loaded' // завантаження завершене
    },
    [fetchPosts.rejected]: (state) => { // стан коли помилка
      state.posts.items = []
      state.posts.status = 'error'
    },
    // Отримання тегів
    [fetchTags.pending]: (state) => { // коли завантаження
      state.tags.items = [] // скидання елементів (сброс)
      state.tags.status = 'loading'
    },
    [fetchTags.fulfilled]: (state, action) => { // коли успішне завершення
      state.tags.items = action.payload
      state.tags.status = 'loaded' // завантаження завершене
    },
    [fetchTags.rejected]: (state) => { // стан коли помилка
      state.tags.items = []
      state.tags.status = 'error'
    },
    // Видалення статті
    [fetchRemovePosts.pending]: (state, action) => { // коли завантаження
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg) // шукаємо в постс елементи і не дочекавшись відповіді відразу видаляти статтю з масиву
    },
  } // будемо описувати стан нашого екшену
})

export default postsSlice.reducer