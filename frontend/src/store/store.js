import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/userSlice'
import postSlice from '../features/postSlice'
import chatSlice from '../features/ChatSlice'


export const store = configureStore({
    reducer: {
        user: userSlice,
        posts: postSlice,
        chats: chatSlice
    }
})