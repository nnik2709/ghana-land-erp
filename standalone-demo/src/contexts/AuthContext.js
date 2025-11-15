import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Mock user data - no backend needed
const MOCK_USERS = {
  'kofi.mensah@example.com': {
    id: 'f5dd19cf-14c0-4a84-9646-f92d70fc8561',
    email: 'kofi.mensah@example.com',
    full_name: 'Kofi Mensah',
    role: 'citizen',
    phone: '+233 24 123 4567',
    created_at: '2024-01-15T10:30:00Z'
  },
  'ama.adjei@example.com': {
    id: '430ab24f-6fba-449a-84b7-885eadefc674',
    email: 'ama.adjei@example.com',
    full_name: 'Ama Adjei',
    role: 'surveyor',
    phone: '+233 24 234 5678',
    created_at: '2024-01-10T09:00:00Z'
  },
  'abena.osei@example.com': {
    id: '8c9f2d4e-1a3b-4c5d-6e7f-8g9h0i1j2k3l',
    email: 'abena.osei@example.com',
    full_name: 'Abena Osei',
    role: 'lands_officer',
    phone: '+233 24 345 6789',
    created_at: '2024-01-05T08:00:00Z'
  },
  'kwame.nkrumah@example.com': {
    id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    email: 'kwame.nkrumah@example.com',
    full_name: 'Kwame Nkrumah',
    role: 'admin',
    phone: '+233 24 456 7890',
    created_at: '2024-01-01T07:00:00Z'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('standalone_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Load user from localStorage
      const savedUser = localStorage.getItem('standalone_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, [token]);

  async function login(username, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials (password is always 'password123' for demo)
    const mockUser = MOCK_USERS[username];
    
    if (mockUser && password === 'password123') {
      const mockToken = 'mock_token_' + Date.now();
      
      localStorage.setItem('standalone_token', mockToken);
      localStorage.setItem('standalone_user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);

      return { success: true, user: mockUser };
    } else {
      return {
        success: false,
        message: 'Invalid credentials. Use any demo email with password: password123'
      };
    }
  }

  function logout() {
    localStorage.removeItem('standalone_token');
    localStorage.removeItem('standalone_user');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
