import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import uiSlice from '../features/ui/uiSlice'
import infoSlice from '../features/info/infoSlice'


export const store = configureStore({
    reducer: {
        auth: authSlice,
        ui: uiSlice,
        info: infoSlice,
    }
})