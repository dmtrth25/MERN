import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from './slices/auth'
import PostReducer from './slices/posts'

const store = configureStore({ // створюємо store
  reducer: {
    posts: PostReducer,
    auth: AuthReducer
  }
})

export default store