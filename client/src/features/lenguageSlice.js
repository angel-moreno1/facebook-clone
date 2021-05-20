import { createSlice } from '@reduxjs/toolkit'
import { LOCALES } from '../i18n/locales'

const initialState = {
    language: LOCALES.SPANISH
}

const lenguageSlice = createSlice({
    name: 'lenguage',
    initialState,
    reducers: {
        changeLenguage: (state, action) => {
            state.language = state.language === LOCALES.SPANISH ? LOCALES.ENGLISH : LOCALES.SPANISH
        }
    }
})

export const { changeLenguage } = lenguageSlice.actions

export const selectLenguage = state => state.lenguage

export default lenguageSlice.reducer