import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wargatech_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('wargatech_token'));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isWarga = user?.role === 'warga';
  const isPetugas = user?.role === 'petugas';

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { token: newToken, data: userData } = response;
      localStorage.setItem('wargatech_token', newToken);
      localStorage.setItem('wargatech_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Login gagal';
      return { success: false, status, message, data: error.response?.data };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors — still clear local state
    } finally {
      localStorage.removeItem('wargatech_token');
      localStorage.removeItem('wargatech_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('wargatech_user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isWarga,
    isPetugas,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
