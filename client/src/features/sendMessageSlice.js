import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const createOrRedirectToChat = createAsyncThunk(
    'chat/createOrRedirectToChat',
    async ({ friendId, token }, _thunkApi) => {
        const { data } = await axios.post('http://localhost:3001/api/chat', { id: friendId }, { headers: { Authorization: `Bearer ${token}` } })
        
        return data
    }
)
    
const initialState = {
        createdChat: {},
        isLoading: false,
        hasError: false
        
}

const messageSlice = createSlice(
    {
        name: 'messages',
        initialState,
        reducers: {
            clearState: (state, action) => {
                state.createdChat = {}
            }
        },
        extraReducers: {
            [createOrRedirectToChat.pending]: (state, action) => {
                state.isLoading = true
                state.hasErrort = false
            },
            [createOrRedirectToChat.fulfilled]: (state, action) => {
                state.isLoading = false
                state.hasError = false
                state.createdChat = action.payload
            },
            [createOrRedirectToChat.rejected]: (state, action) => {
                state.isLoading = false
                state.hasError = true
            }
        }
    }
)

export const { clearState } = messageSlice.actions

export default messageSlice.reducer