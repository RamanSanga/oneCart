import React, { useContext, useState, createContext, useEffect, useCallback } from 'react';
import { authDataContext } from './AuthContext.jsx';
import axios from 'axios';

export const adminDataContext = createContext();

function AdminContext({ children }) {
  const { serverUrl: ctxServerUrl } = useContext(authDataContext) || {};
  // fallback to your backend default if context not yet set
  const serverUrl = ctxServerUrl || 'http://localhost:8000';

  const [adminData, setAdminData] = useState(null);

  const getAdmin = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getadmin`, {
        withCredentials: true, // send cookies
        headers: { 'Content-Type': 'application/json' }
      });
      setAdminData(result.data);
      console.log('getAdmin:', result.data);
    } catch (error) {
      setAdminData(null);
      // log useful info for debugging
      console.warn('getAdmin error:', error?.response?.status, error?.response?.data || error.message);
    }
  }, [serverUrl]);

  useEffect(() => {
    // only call when serverUrl is available (or fallback used)
    getAdmin();
  }, [getAdmin]);

  const value = { adminData, setAdminData, getAdmin };

  return (
    <adminDataContext.Provider value={value}>
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminContext;