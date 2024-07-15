import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:'chats',
    initialState:{
        messages: localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages')) : [],
    },
    reducers:{
        setMessages(state,action){
          const existingMessages = new Map(state.messages.map(msg => [msg.id, msg]));
          action.payload.forEach(msg => {
            existingMessages.set(msg.id, msg);
          });
          const newMessages = Array.from(existingMessages.values());
          state.messages = newMessages.slice(-10);
          localStorage.setItem('messages', JSON.stringify(state.messages));
        },
        addMessage(state,action){
          const exists = state.messages.some(existingMsg => existingMsg.id === action.payload.id);
          if (!exists) {
            state.messages.push(action.payload);
            if (state.messages.length > 10) {
              state.messages = state.messages.slice(-10);
            }
            localStorage.setItem('messages', JSON.stringify(state.messages));
          }
        },
    }
})

export const chatActions=chatSlice.actions;
export default chatSlice.reducer;