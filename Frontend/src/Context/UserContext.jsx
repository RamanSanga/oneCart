// ...existing code...
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authDataContext } from "./authContext";

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const { serverUrl: ctxServerUrl } = useContext(authDataContext) || {};
  const serverUrl = ctxServerUrl || "http://localhost:8000";

  const getCurrentUser = async () => {
    try {
      // server route is usually a GET — use GET to match backend route
      const result = await axios.get(`${serverUrl}/api/user/getcurrentuser`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setUserData(result.data);
      console.log("Current user:", result.data);
    } catch (error) {
      console.error("getCurrentUser error:", error?.response?.status, error?.response?.data || error.message);
      setUserData(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [serverUrl]); // re-run when serverUrl changes

  let value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
// ...existing code...