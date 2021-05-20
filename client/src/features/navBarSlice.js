import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const searchUsers = createAsyncThunk(
    'navBar/searchUsers',
    async (query, _thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/users/find/user?query=${query}`)
      
        return data
    }
)

const initialState = {
    results: [],
    isLoading: false,
    hasError: false
}

const navBarSlice = createSlice({
    name: 'navBar',
    initialState,
    extraReducers: {
        [searchUsers.pending]: (state, action) => {
            state.isLoading = true
            state.hasError = false
        },
        [searchUsers.fulfilled]: (state, action) => {
            state.isLoading = false
            state.hasError = false
            state.results = action.payload
        },
        [searchUsers.rejected]: (state, action) => {
            state.isLoading = false
            state.hasError = true
        }
    }
})


export default navBarSlice.reducer