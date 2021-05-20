import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getAllFriends = createAsyncThunk(
    'home/getAllFriends',
    async (userId, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/users/${userId}/friend/all`)
        
        return data
    }
)

const initialState = {
    friends: [],
    isLoadingFriends: false,
    hasErrorFriends: false
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearFriends: (state, action) => {
            state.friends = []
        }
    },
    extraReducers: {
        [getAllFriends.pending]: (state, action) => {
            state.isLoadingFriends = true
            state.hasErrorFriends = false
        },
        [getAllFriends.fulfilled]: (state, action) => {
            state.isLoadingFriends = false
            state.hasErrorFriends = false
            state.friends = action.payload
        },
        [getAllFriends.rejected]: (state, action) => {
            state.isLoadingFriends = false
            state.hasErrorFriends = true
        }
    }
})

export const { clearFriends } = homeSlice.actions

export const selectHomeState = state => state.home

export default homeSlice.reducer