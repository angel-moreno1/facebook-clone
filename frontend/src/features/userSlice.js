import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const userLogin = createAsyncThunk(
    'user/userLogin',
    async (userData, thunkApi) => {
        const { data } = await axios.post('http://localhost:3001/api/users/login', userData)

        return data
    }
)

export const loadUserPosts = createAsyncThunk(
    'user/loadUserPosts',
    async (id, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/post/${id}/posts`)
        return data
    }
)

const initialState = {
    user: {},
    posts: [],
    isLoading: false,
    hasError: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        logout: (state, action) => {
            state.user = {}
            state.posts = []
            state.socket = {}
        },
        addUserPost: (state, action) => {
            state.posts.unshift(action.payload)
        },
        changeDesc: (state, action) => {
            state.user.description = action.payload
        }
    },
    extraReducers: {
        [loadUserPosts.pending]: (state, _action) => {
            state.isLoading = true
            state.hasError = false
        },
        [loadUserPosts.fulfilled]: (state, action) => {
            state.isLoading = false
            state.hasError = false
            state.posts = action.payload.reverse()
        },
        [loadUserPosts.rejected]: (state, _action) => {
            state.isLoading = false
            state.hasError = true
        },
        [userLogin.pending]: (state, _action) => {
            state.isLoading = true
            state.hasError = false
        },
        [userLogin.fulfilled]: (state, action) => {
            state.isLoading = false
            state.hasError = false
            state.user = action.payload
        },
        [userLogin.rejected]: (state, _action) => {
            state.isLoading = false
            state.hasError = true
        }
    }
})

export const selectUser = state => 
    Object.keys(state.user.user).length > 1
         ? state.user.user 
         : localStorage.getItem('token') && window.localStorage.getItem('user')
            ? JSON.parse(window.localStorage.getItem('user'))
            : null

export const { login, logout, addUserPost, changeDesc} = userSlice.actions

export default userSlice.reducer