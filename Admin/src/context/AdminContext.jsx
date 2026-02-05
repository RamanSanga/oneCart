import React, { useContext, useState, createContext, useEffect, useCallback } from 'react';
import { authDataContext } from './AuthContext.jsx';
import axios from 'axios';

export const adminDataContext = createContext();

function AdminContext({ children }) {
  const { serverUrl } = useContext(authDataContext);

  const [adminData, setAdminData] = useState(null);

  const getAdmin = useCallback(async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/admin/stats`,   // ✅ CORRECT ROUTE
        { withCredentials: true }
      );

      setAdminData(result.data);
      console.log("Admin stats:", result.data);

    } catch (error) {
      console.error(
        "getAdmin error:",
        error?.response?.status || error.message
      );
      setAdminData(null);
    }
  }, [serverUrl]);

  useEffect(() => {
    if (serverUrl) {
      getAdmin();
    }
  }, [getAdmin, serverUrl]);

  return (
    <adminDataContext.Provider value={{ adminData, setAdminData, getAdmin }}>
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;

