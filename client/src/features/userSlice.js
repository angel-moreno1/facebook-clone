import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/'

export const changeDesc = createAsyncThunk(
    'user/changeDescription',
    async ({ userId, description, token }, thunkApi) => {
       const { data } = await axios.put(`${baseUrl}users/${userId}`, { description }, { headers: { Authorization: `Bearer ${token}` } })
       const updatedUser = {...JSON.parse(localStorage.getItem('user')), description}
       localStorage.setItem('user', JSON.stringify(updatedUser))
     
       return data
    }
)

export const changeInfo = createAsyncThunk(
    'user/changeInformation',
    async ({userId, info, token}, thunkApi) => {
        const { data } = await   axios.put(`http://localhost:3001/api/users/${userId}`, info, { headers: { Authorization: `Bearer ${token}` } })

        localStorage.setItem('user', JSON.stringify(data))

        return data     
    }
)

export const userLogin = createAsyncThunk(
    'user/userLogin',
    async (userData, thunkApi) => {
        const { data } = await axios.post(`${baseUrl}users/login`, userData)

        return data
    }
)

export const loadUserPosts = createAsyncThunk(
    'user/loadUserPosts',
    async ({id, token}, thunkApi) => {
        const { data } = await axios.get(`${baseUrl}post/${id}/posts`, { headers: { Authorization: `Bearer ${token}` } })
        return data
    }
)

const initialState = {
    user: {},
    posts: [],
    isLoading: false,
    hasError: false,
    isLoadingUpdated: false,
    hasErrorUpdated: false,
    hasErrorUpdatedInfo: false,
    isLoadingUpdatedInfo: false
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
        setDescription: (state, action) => {
            state.user.description = action.payload
        },
        updatedUserPhoto: (state, action) => {
            state.user.profile_photo = action.payload
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
        },
        [changeDesc.pending]: (state, _action) => {
            state.isLoadingUpdated = true
            state.hasErrorUpdated = false
        },
        [changeDesc.fulfilled]: (state, action) => {
            state.isLoadingUpdated = false
            state.hasErrorUpdated = false
            state.user.description = action.payload[0]
        },
        [changeDesc.rejected]: (state, _action) => {
            state.isLoadingUpdated = false
            state.hasErrorUpdated = true
        },
        // [changeInfo.pending]: (state, _action) => {
        //     state.isLoadingUpdated = true
        //     state.hasErrorUpdated = false
        // },
        [changeInfo.fulfilled]: (state, action) => {
            state.isLoadingUpdatedInfo = false
            state.hasErrorUpdatedInfo = false
            state.user = action.payload
        }
        // [changeInfo.rejected]: (state, _action) => {
        //     state.isLoadingUpdated = false
        //     state.hasErrorUpdated = true
        // }
    }
})

export const selectUser = state => 
    Object.keys(state.user.user).length > 1
         ? state.user.user 
         : localStorage.getItem('token') && window.localStorage.getItem('user')
            ? JSON.parse(window.localStorage.getItem('user'))
            : null

export const { login, logout, addUserPost, updatedUserPhoto } = userSlice.actions

export default userSlice.reducer