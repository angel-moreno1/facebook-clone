import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit'
import axios from 'axios'

export const loadLatestChats = createAsyncThunk(
    'chat/loadLatestChats',
    async (id, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/chat/${id}/latest`)

        return data.chats
    }
)

export const loadCurrentChat = createAsyncThunk(
    'chat/loadCurrentChat',
    async (id, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/chat/${id}`)

        return data
    }
) 

const initialState = {
    latestMessages: [],
    currentChat: [],
    isLoading: false,
    hasError: false
}

const ChatSlice = createSlice(
    {
        name: 'chat',
        initialState,
        reducers: {
            addNewMessage: (state, action) => {
                state.currentChat = [...state.currentChat, action.payload]
            }
        },
        extraReducers: {
            [loadLatestChats.pending]: (state, action) => {
                state.isLoading = true
                state.hasError = false
            },
            [loadLatestChats.fulfilled]: (state, action) => {
                state.latestMessages = action.payload
                state.isLoading = false
                state.hasError = false
            },
            [loadLatestChats.rejected]: (state, action) => {
                state.isLoading = false
                state.hasError = true
            },
            [loadCurrentChat.pending]: (state, action) => {
                state.isLoading = true
                state.hasError = false
            },
            [loadCurrentChat.fulfilled]: (state, action) => {
                state.isLoading = false
                state.hasError = false
                state.currentChat = action.payload
            },
            [loadCurrentChat.rejected]: (state, action) => {
                state.isLoading = false
                state.hasError = true
            }
        }
    }
)

export const { addNewMessage } = ChatSlice.actions

export const selectChats = state => state.chats


export default ChatSlice.reducer