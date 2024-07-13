import React, { useState } from 'react'

const Chatbox = () => {
  
  return (
    <div className="w-full max-w-4xl mx-auto md:p-6 h-full">

      <div className="dark:border dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">

        <div className="py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600">
          <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Hello, welcome to the chat!</p>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto ">
          {/* messages */}
        </div>

        <div className="p-4 border-t border-gray-300 dark:border-gray-600">
          <form className="flex">
            <input
              type="text"
              placeholder="Type your message..."
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
}

export default Chatbox