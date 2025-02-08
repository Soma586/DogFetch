import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Check initial auth status on app load
  useEffect(() => {
    //checkAuthStatus();
  }, [isAuthenticated]);

  // const checkAuthStatus = async () => {
  //   try {
  //     const response = await fetch('/api/check-auth', {
  //       credentials: 'include'
  //     });
  //     if (response.ok) {
  //       setIsAuthenticated(true);
  //       startLogoutTimer();
  //     }
  //   } catch (error) {
  //     setIsAuthenticated(false);
  //   }
  // };

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

    console.log("this has been called")
    console.log(credentials)
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('this is the response')
      console.log(response)
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

  const handleLogout = async () => {
    try {
      await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
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