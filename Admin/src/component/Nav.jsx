// src/components/AdminNavbar.jsx
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {useContext} from 'react'
import {authDataContext} from '../context/AuthContext.jsx'
import {adminDataContext} from '../context/AdminContext.jsx'


export default function AdminNavbar() {
  const navigate = useNavigate();
  let {serverUrl} = useContext(authDataContext)
  let {getAdmin} = useContext(adminDataContext)


  const logout = async ()=>{
    try{
        const result = await axios.get(serverUrl + "/api/auth/logout" , {withCredentials:true})
        console.log(result.data)
        navigate("/login")

    }
    catch(error){

    }
  }

  return (
    <nav className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 fixed top-0 left-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-5">
        
        {/* LOGO */}
        <h1
          className="text-3xl tracking-tight font-light text-black cursor-pointer"
          onClick={() => navigate("/")}
        >
          OneCart <span className="text-sm text-gray-500 ml-1">Admin</span>
        </h1>

        {/* LOGOUT */}
        <button
          className="flex items-center gap-2 text-[15px] text-gray-700 font-light hover:text-black transition "
          aria-label="Admin Logout"
          onClick={logout}
        >
          <FiLogOut className="text-xl" />
          Logout
        </button>

      </div>
    </nav>
  );
}
