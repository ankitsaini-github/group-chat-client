import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authReducer'

const store=configureStore({
    reducer:{
        auth:authSlice,
    }
})

export default store;