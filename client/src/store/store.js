import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/userSlice'
import postSlice from '../features/postSlice'
import chatSlice from '../features/chatSlice'
import videosSlice from '../features/videosSlice'
import navBarSlice from '../features/navBarSlice'
import friendSlice from '../features/friendSlice'
import sendMessageSlice from '../features/sendMessageSlice'
import homeSlice from '../features/homeSlice'
import commentsSlice from '../features/commentsSlice'
import lenguageSlice from '../features/lenguageSlice'
import notifySlice from '../features/notifySlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        posts: postSlice,
        chats: chatSlice,
        videosPosts: videosSlice,
        navBar: navBarSlice,
        friend: friendSlice,
        messages: sendMessageSlice,
        home: homeSlice,
        comments: commentsSlice,
        lenguage: lenguageSlice,
        notify: notifySlice
    }
})