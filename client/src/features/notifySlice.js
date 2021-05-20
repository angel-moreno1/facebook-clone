import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifycation: '',
    isLoading: false,
    hasError: false
}

const notifySlice = createSlice({
    name: 'notify',
    initialState,
    reducers: {
        newNotification: (state, action) => {
            state.notifycation = '¡You have a new message!'
        },
        clearNotification: (state, action) => {
            state.notifycation = ''
        }
    }
})

export const { newNotification, clearNotification } = notifySlice.actions

export default notifySlice.reducer