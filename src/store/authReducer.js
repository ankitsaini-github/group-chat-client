import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'authentication',
    initialState:{
        isloggedin: window.localStorage.getItem('token')?true:false,
    },
    reducers:{
        login(state, action){
            window.localStorage.setItem('token', action.payload.token)
            window.localStorage.setItem('useremail', action.payload.email);
            window.localStorage.setItem('userId', action.payload.userId);
            state.isloggedin=true
        },
        logout(state){
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('useremail');
            window.localStorage.removeItem('userId');
            state.isloggedin=false
        },
    }
})

export const authActions=authSlice.actions;
export default authSlice.reducer;