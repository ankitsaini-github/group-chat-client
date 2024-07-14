import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { chatActions } from "../../store/chatReducer";
import { toast } from "react-toastify";

const Chatbox = () => {
  const messages = useSelector((state) => state.chats.messages);
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    let cancelRequest = false;
    const fetchAllChat = async(lastId)=>{
      console.log('fetching all chats...');
      
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_IP}/chat/all`,{ 
          params: { lastId },
          headers: { 'Authorization': token }
        });
        // dispatch(chatActions.setMessages(res.data.messages));
        if (!cancelRequest && res.data.messages.length>0) {
          dispatch(chatActions.setMessages(res.data.messages));
        }
      } catch (error) {
        // console.log("Error while Fetching chat : ", error.response.data.error);
        // toast.error(error.response.data.error);
        if (!cancelRequest) {
          console.log("Error while Fetching chat : ", error.response.data.error);
          toast.error(error.response.data.error);
        }
      }
    } 
    const oldMessages = JSON.parse(localStorage.getItem('messages')) || []
    const lastId = oldMessages.length > 0 ? oldMessages[oldMessages.length - 1].id : undefined;
    // fetchAllChat(lastId);
    const interval = setInterval(() => fetchAllChat(lastId) , 1000);
    return () => {
      clearInterval(interval);
      cancelRequest = true;
    }

  }, []);
  

  const sendChat = async(e) => {
    e.preventDefault();
    if (input.trim()) {

      const token = localStorage.getItem('token');
      try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_IP}/chat/send`,{message:input},{headers:{'Authorization' : token}});
        dispatch(chatActions.addMessage(res.data.message));
      } catch (error) {
        console.log("Error while sending message : ", error.response.data.error);
        toast.error(error.response.data.error);
      }

      setInput("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto md:p-6 h-full">
      <div className="dark:border dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="py-3 px-4 bg-gradient-to-b from-violet-600 to-violet-900">
          <p className="text-xl font-bold leading-tight tracking-tight text-white">
            Hello, welcome to the chat!
          </p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto ">
          {/* messages */}
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          ) : (
            [...new Map(messages.map(msg => [msg.id, msg])).values()].map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 ${
                  msg.userId == userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs break-words px-4 py-2 rounded-lg shadow ${
                    msg.userId == userId
                      ? "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  }`}
                >
                  <p className="font-medium">{msg.sender}</p>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-300 dark:border-gray-600">
          <form className="flex" onSubmit={sendChat}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-violet-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-violet-700 text-white rounded-r-lg hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
