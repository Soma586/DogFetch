import { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from './utiltiy';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Check initial auth status on app load
  useEffect(() => {
    //checkAuthStatus();
  }, [isAuthenticated]);


  const startLogoutTimer = () => {
    // Clear existing timer
    if (logoutTimer) clearTimeout(logoutTimer);
    
    // Set new timer for 1 hour (3600000 ms)
    const timer = setTimeout(() => {
      handleLogout();
    }, 3600000);
    
    setLogoutTimer(timer);
  };

  const handleLogin = async (credentials) => {


    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        startLogoutTimer();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = async (handleFullResetOnLogOut) => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      handleFullResetOnLogOut()
      
      if (logoutTimer) clearTimeout(logoutTimer);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);