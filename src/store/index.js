import authSlice from './authReducer'
import chatSlice from './chatReducer'
import { configureStore } from "@reduxjs/toolkit";

const store=configureStore({
    reducer:{
        auth:authSlice,
        chats:chatSlice,
    }
})

export default store;