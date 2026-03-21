import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'admin-1',
    phone: 'admin',
    name: 'Administrador',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'customer-1',
    phone: 'cliente',
    name: 'Cliente',
    role: 'customer',
    password: '123456',
  },
];

function normalizeStoredUser(value: unknown): User | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<User>;
  if (!candidate.id || !candidate.phone) {
    return null;
  }

  return {
    id: candidate.id,
    phone: candidate.phone,
    name: candidate.name ?? 'Cliente',
    role: candidate.role === 'admin' ? 'admin' : 'customer',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(normalizeStoredUser(JSON.parse(savedUser)));
      } catch (error) {
        console.error('Erro ao restaurar usuario:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    try {
      const normalizedPhone = phone.trim().toLowerCase();
      const matchedUser = MOCK_USERS.find(
        (candidate) =>
          candidate.phone.toLowerCase() === normalizedPhone &&
          candidate.password === password
      );

      if (!matchedUser) {
        throw new Error('Credenciais invalidas');
      }

      const authenticatedUser: User = {
        id: matchedUser.id,
        phone: matchedUser.phone,
        name: matchedUser.name,
        role: matchedUser.role,
      };

      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
