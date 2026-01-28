import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AuthContext from './Context/authContext.jsx'
import UserContext from './Context/userContext.jsx'
import ShopContext from './Context/shopContext.jsx'
import "./animations.css";


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContext>
    <UserContext>
      <ShopContext>
    <App />
      </ShopContext>
    </UserContext>
    </AuthContext>
  </BrowserRouter>
  
)
