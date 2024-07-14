import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:'chats',
    initialState:{
        messages: JSON.parse(localStorage.getItem('messages')) || [],
    },
    reducers:{
        setMessages(state,action){
          const newMessages = action.payload.filter(msg => !state.messages.some(existingMsg => existingMsg.id === msg.id));
          state.messages=state.messages.concat(newMessages);
          localStorage.setItem('messages',JSON.stringify(state.messages));
        },
        addMessage(state,action){
          state.messages.push(action.payload)
          localStorage.setItem('messages',JSON.stringify(state.messages));
        },
    }
})

export const chatActions=chatSlice.actions;
export default chatSlice.reducer;