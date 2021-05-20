import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const loadVideosPost = createAsyncThunk(
    'videos/loadVideosPost',
    async (token, thunkApi) => {
        const { data } = await axios.get('http://localhost:3001/api/post/videos/all', { headers: { Authorization: `Bearer ${token}` } })
        return data
    }
)

const initialState = {
    posts: [],
    isLoading: false,
    hasError: false
}

const videosSlice = createSlice({
    name: 'videos',
    initialState,
    extraReducers: {
        [loadVideosPost.pending]: (state, action) => {
            state.isLoading = true
            state.hasError = false
        },
        [loadVideosPost.fulfilled]: (state, action) => {
            state.isLoading = false
            state.hasError = false
            state.posts = action.payload
        },
        [loadVideosPost.rejected]: (state, action) => {
            state.isLoading = false
            state.hasError = true
        }
    }
})

export const selectVideosPostsState = state => state.videosPosts

export default videosSlice.reducer