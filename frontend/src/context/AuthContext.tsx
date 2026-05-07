import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setLoading(false);
        return;
    }
    
    try {
        const res = await api.get('/users/profile');
        setUser(res.data);
    } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const login = async (token: string) => {
    localStorage.setItem('token', token);
    setLoading(true); // Bật loading để fetch dữ liệu sạch
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
