import React from 'react'
import { createContext } from 'react'

export const authDataContext = createContext();
function authContext({children}) {
    let serverUrl = "http://localhost:8000"
    let value = {
        serverUrl
    }
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  )
}

export default authContext
