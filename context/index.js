import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: '',
  });

  // console.log('token', auth);
  // config axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth?.token}`;

  useEffect(() => {
    if (localStorage.getItem('auth')) {
      setAuth(JSON.parse(localStorage.getItem('auth')));
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
