// ...existing code...
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Add from './pages/Add.jsx'
import Orders from './pages/Orders.jsx'
import List from './pages/List.jsx'
import { useContext } from 'react'
import { adminDataContext } from './context/AdminContext.jsx'

function App() {
  const { adminData } = useContext(adminDataContext)
  return (
    <>
      {!adminData ? (
        <Login />
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/add' element={<Add />} />
          <Route path='/list' element={<List />} />
          <Route path='/orders' element={<Orders />} />
        </Routes>
      )}
    </>
  )
}

export default App
// ...existing code...
