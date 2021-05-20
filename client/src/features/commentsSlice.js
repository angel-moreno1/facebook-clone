import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const newComment = createAsyncThunk(
    'comments/newComment',
    async ({ id, text, token }, thunkApi) => {
        const { data } = await axios.put(`http://localhost:3001/api/post/${id}/comment`, { text }, { headers: { Authorization: `Bearer ${token}` } })

        return data
    }
)

export const loadComments = createAsyncThunk(
    'comments/loadComments',
    async ({ id, token }, thunkApi) => {
        const { data } = await axios.get(`http://localhost:3001/api/post/${id}`, { headers: { Authorization: `Bearer ${token}` } })

        return data.comments ? data.comments : []
    }
)

const initialState = {
    comments: [],
    isLoadingComments: false,
    hasErrorComments: false
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addComment: (state, action) => {
            state.comments.push(action.payload)
        }
    },
    extraReducers: {
        [loadComments.pending]: (state, action) => {
            state.isLoadingComments = true
            state.hasErrorComments = false
        },
        [loadComments.fulfilled]: (state, action) => {
            state.isLoadingComments = false
            state.comments = action.payload

        },
        [loadComments.rejected]: (state, action) => {
            state.isLoadingComments = false
            state.hasErrorComments = true
        },
        [newComment.pending]: (state, action) => {
            state.isLoadingComments = true
            state.hasErrorComments = false
        },
        [newComment.fulfilled]: (state, action) => {
            state.isLoadingComments = false
            state.comments.push(action.payload)

        },
        [newComment.rejected]: (state, action) => {
            state.isLoadingComments = false
            state.hasErrorComments = true
        },
    }
})

export default commentsSlice.reducer