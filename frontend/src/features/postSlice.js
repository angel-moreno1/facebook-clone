import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { addUserPost } from './userSlice'

export const giveLikeToPost = createAsyncThunk(
    'posts/giveLikeToPost',
    async ({ userid, postId, type }, thunkApi) => {
        console.log(userid, postId, type)
        const { data } = axios.put(`http://localhost:3001/api/post/${postId}/like`, { id: userid, type })

        return data
    }
)

export const loadInitialPost = createAsyncThunk(
    'posts/loadInitialPosts',
    async (arg, thunkApi) => {
        const { data } = await axios.get('http://localhost:3001/api/post/') 
        
        return data
    }
)

export const cratePost = createAsyncThunk(
    'posts/createPost',
    async ({ postData, socket, token }, { dispatch }) => {
        const { data } = await axios.post(
            'http://localhost:3001/api/post/',
            postData,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        dispatch(addUserPost(data))
        socket.emit('newPost', data)
        return data
    }
)

const initialState = {
    posts: [],
    isLoading: false,
    hasError: false
}


const postSlice = createSlice(
    {
        name: 'posts',
        initialState,
        reducers: {
            addCommentsToPost: (state, action) => {
                state.posts = action.payload
            },
            addPost: (state, action) => {
                state.posts.unshift(action.payload)
            },
            giveLike: (state, action) => {
                state.posts.forEach(
                    post => post._id === action.payload.postid ?  post.likes.push(action.payload.userid) : null
                )
            },
            setPost: (state, action) => {
                state.posts = []
            }
        },
        extraReducers: {
            [loadInitialPost.pending]: (state, action) => {
                state.isLoading = true
                state.hasError = false;
            },
            [loadInitialPost.fulfilled]: (state, action) => {
                state.posts = action.payload
                state.isLoading = false
                state.hasError = false
            },
            [loadInitialPost.rejected]: (state, action) => {
                state.isLoading = false
                state.hasError = true
            },
            [cratePost.pending]: (state, action) => {
                state.hasError = false;
            },
            [cratePost.fulfilled]: (state, action) => {
                state.posts.unshift(action.payload)
                state.hasError = false
            },
            [cratePost.rejected]: (state, action) => {
                state.hasError = true
            }
            // [giveLikeToPost.pending]: (state, action) => {
            //     state.hasError = false;
            // },
            // [giveLikeToPost.fulfilled]: (state, action) => {
            //     state.hasError = false
            // },
            // [giveLikeToPost.rejected]: (state, action) => {
            //     state.hasError = true
            // }
        }
    }
)

export const selectPost = state => state.posts

export const { addPost, addCommentsToPost, setPost } = postSlice.actions

export default postSlice.reducer