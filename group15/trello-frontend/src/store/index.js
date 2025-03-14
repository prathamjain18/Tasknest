import { configureStore } from "@reduxjs/toolkit"
import UserReducer from './slices/user/UserSlice'
import logger from "redux-logger"

export const store = configureStore({
    reducer: {
        user: UserReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
})
