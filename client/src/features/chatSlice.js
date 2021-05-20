import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const latestChatsFriendInformaiton = createAsyncThunk(
    'chat/currentChatFriend',
    async ({friend, token}, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/users/${friend}`, { headers: { Authorization: `Bearer ${token}` } })

        return { name: data.name, lastName: data.lastName }
    }
)

export const loadLatestChats = createAsyncThunk(
    'chat/loadLatestChats',
    async ({id, token}, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/chat/${id}/latest`, { headers: { Authorization: `Bearer ${token}` } })

        return data.chats
    }
)

export const loadCurrentChat = createAsyncThunk(
    'chat/loadCurrentChat',
    async ({id, token}, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/chat/${id}`, { headers: { Authorization: `Bearer ${token}` } })

        return data
    }
) 

const initialState = {
    latestMessages: [],
    currentChat: {
        messages: []
    },
    latestMessagesFriend: [],
    isLoading: false,
    hasError: false,
    isLoadingCurrentChat: false,
    hasErrorCurrentChat: false,
    currentConversationId: null,
}

const chatSlice = createSlice(
    {
        name: 'chat',
        initialState,
        reducers: {
            setCurrentChat: (state, action) => {
                state.currentChat = { messages: [] } 
            },
            addNewMessage: (state, action) => {
                if(state.currentConversationId === action.payload.chatId){
                    state.currentChat.messages.push(action.payload.msg)
                }
            },
            setLatestMessagesFriend: (state, action) => {
                state.latestMessagesFriend = []
            },
            setCurrentConversationId: (state, action) => {
                state.currentConversationId = action.payload
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
                state.isLoadingCurrentChat = true
                state.hasErrorCurrentChat = false
            },
            [loadCurrentChat.fulfilled]: (state, action) => {
                state.isLoadingCurrentChat = false
                state.hasErrorCurrentChat = false
                state.currentChat = action.payload
            },
            [loadCurrentChat.rejected]: (state, action) => {
                state.isLoadingCurrentChat = false
                state.hasErrorCurrentChat = true
            },
            [latestChatsFriendInformaiton.pending]: (state, action) => {
                state.hasError = false
            },
            [latestChatsFriendInformaiton.fulfilled]: (state, action) => {
                state.hasError = false
                state.latestMessagesFriend.push(action.payload)
            },
            [latestChatsFriendInformaiton.rejected]: (state, action) => {
                state.isLoading = false
                state.hasError = true
            }
        }
    }
)

export const { addNewMessage, setLatestMessagesFriend, setCurrentChat, setCurrentConversationId } = chatSlice.actions

export const selectChats = state => state.chats

export default chatSlice.reducer