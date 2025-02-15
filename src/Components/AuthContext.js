import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial authentication state

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };