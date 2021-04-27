import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const giveLikePost = createAsyncThunk(
    'actions/giveLikePost',
    async ({id, type}, { getState }) => {
       const { data } = await axios.put(`https://desolate-thicket-83965.herokuapp.com/api/post/${id}/like`, {id: getState().user.user.id, type})
       return data
    }
)

const initialState = {
    likes: 0
}

const actionsSlice = createSlice({
    name: 'actions',
    initialState,
    reducers: {
        
    }
})