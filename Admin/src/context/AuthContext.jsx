import React, { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;

