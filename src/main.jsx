import './index.css'
import "react-toastify/dist/ReactToastify.css";

import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer
        bodyClassName="toastBody"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
  </React.StrictMode>,
)
