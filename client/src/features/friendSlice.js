import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const LoadFriendInformation = createAsyncThunk(
    'friend/loadFriendInformation',
    async ({friendId, token}, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/users/${friendId}`, { headers: { Authorization: `Bearer ${token}` } })

        return data
    }
)

export const LoadFriendPosts = createAsyncThunk(
    'friend/loadFriendPosts',
    async ({friendId, token}, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/post/${friendId}/posts`, { headers: { Authorization: `Bearer ${token}` } })

        return data
    }
)

const initialState = {
    posts: [],
    friendInformation: {},
    isLoading: false,
    hasError: false
}

const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        addAsAFriend: (state, action) => {
            state.friendInformation.friends.push(action.payload)
        }
    },
    extraReducers: {
        [LoadFriendInformation.pending]: (state, _action) => {
            state.isLoading = true
            state.hasError = false
        },
        [LoadFriendInformation.fulfilled]: (state, action) => {
            state.isLoading = false
            state.hasError = false
            state.friendInformation = action.payload
        },
        [LoadFriendInformation.rejected]: (state, _action) => {
            state.isLoading = false
            state.hasError = true
        },
        [LoadFriendPosts.pending]: (state, _action) => {
            state.isLoading = true
            state.hasError = false
        },
        [LoadFriendPosts.fulfilled]: (state, action) => {
            state.isLoading = false
            state.hasError = false
            state.posts = action.payload.reverse()
        },
        [LoadFriendPosts.rejected]: (state, _action) => {
            state.isLoading = false
            state.hasError = true
        }
    }
})

export const { addAsAFriend } = friendSlice.actions

export const selectFriend = state => state.friend

export default friendSlice.reducer