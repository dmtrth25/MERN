import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios'

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params) => {
  const { data } = await axios.post('/auth/login', params) // params - буде зберігатися емейл і пароль
  return data
})

export const fetchRegisterData = createAsyncThunk('auth/fetchRegisterData', async (params) => {
  const { data } = await axios.post('/auth/register', params)
  return data
})

export const fetchMeData = createAsyncThunk('auth/fetchMeData', async () => {
  const { data } = await axios.get('/auth/me') // params не потрібен axios витягне з localStorage token та його передасть
  return data
})

const initialState = {
  data: null,
  status: 'loading'
}

const authSlice = createSlice({
  name: 'auth', // назва
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null
    }
  },
  // інформацію про користвуча будемо отриувати через асинхроний екшен creatAsyncThunk і зберігати в стейт
  extraReducers: {
    [fetchUserData.pending]: (state) => { // коли завантаження
      state.status = 'loading' // якщо завантаження
      state.data = null // якщо робиться запит - то першочергово буде null
    },
    [fetchUserData.fulfilled]: (state, action) => { // коли успішне завершення
      state.status = 'loaded' // завантаження завершене
      state.data = action.payload
    },
    [fetchUserData.rejected]: (state) => { // стан коли помилка
      state.status = 'error' // якщо завантаження
      state.data = null // якщо робиться запит - то першочергово буде null
    },
    [fetchMeData.pending]: (state) => { // коли завантаження
      state.status = 'loading' // якщо завантаження
      state.data = null // якщо робиться запит - то першочергово буде null
    },
    [fetchMeData.fulfilled]: (state, action) => { // коли успішне завершення
      state.status = 'loaded' // завантаження завершене
      state.data = action.payload
    },
    [fetchMeData.rejected]: (state) => { // стан коли помилка
      state.status = 'error' // якщо завантаження
      state.data = null // якщо робиться запит - то першочергово буде null
    },
    [fetchRegisterData.pending]: (state) => { // коли завантаження
      state.status = 'loading' // якщо завантаження
      state.data = null // якщо робиться запит - то першочергово буде null
    },
    [fetchRegisterData.fulfilled]: (state, action) => { // коли успішне завершення
      state.status = 'loaded' // завантаження завершене
      state.data = action.payload
    },
    [fetchRegisterData.rejected]: (state) => { // стан коли помилка
      state.status = 'error' // якщо завантаження
      state.data = null // якщо робиться запит - то першочергово буде null
    },
  }
})

export const isAuthSelector = (state) => Boolean(state.auth.data) // чи є в auth data
export const { logout } = authSlice.actions
export const AuthReducer = authSlice.reducer
