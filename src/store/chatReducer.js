import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:'chats',
    initialState:{
        messages: [],
    },
    reducers:{
        setMessages(state,action){
          state.messages=action.payload;
        },
        addMessage(state,action){
          state.messages.push(action.payload)
        },
    }
})

export const chatActions=chatSlice.actions;
export default chatSlice.reducer;