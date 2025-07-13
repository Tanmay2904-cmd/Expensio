import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [user, setUser] = useState(() => localStorage.getItem('user'));

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    setToken(res.data.token);
    setRole(res.data.role);
    setUser(username);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
    localStorage.setItem('user', username);
  };

  const register = async (username, password, role = 'USER') => {
    try {
      await axios.post('/api/auth/register', { name: username, password, role });
      // Optionally auto-login after register
      await login(username, password);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        throw new Error('Username already exists');
      }
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 