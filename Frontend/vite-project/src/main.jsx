import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import AuthContext from './context/ContextApi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </AuthContext>
  </StrictMode>,
)
