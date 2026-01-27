import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { ROLES, hasPermission as rolesHasPermission, canAccessRoute as rolesCanAccessRoute, getDefaultRoute, isValidRole } from '@/app/constants/roles';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  area: string;
  education: string;
  resumeUrl?: string;
  completedCourses: string[];
  appliedJobs: string[];
  points: number;
  badges: string[];
}

interface StoredUser extends User {
  password?: string; // stored in localStorage for demo purposes
}

interface UserContextType {
  user: User | null;
  registerUser: (userData: User, password?: string) => void;
  loginWithCredentials: (email: string, password?: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'desigualdade_current_user';

function saveCurrentUser(user: User | null) {
  if (user) {
    try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); } catch {}
  } else {
    try { localStorage.removeItem(CURRENT_USER_KEY); } catch {}
  }
}

function loadCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadCurrentUser());

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  const apiBase = (import.meta && (import.meta.env && import.meta.env.VITE_API_URL)) || process.env.VITE_API_URL || 'http://localhost:4000';

  const registerUser = async (userData: User, password?: string) => {
    try {
      const resp = await fetch(`${apiBase.replace(/\/+$/, '')}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, password }),
      });
      const json = await resp.json();
      if (resp.ok) {
        setUser(json.user);
        return true;
      }
      console.error('API register error', json);
      return false;
    } catch (err) {
      console.error('API register failed', err);
      return false;
    }
  };

  // Backwards-compatible login that uses guest endpoint to register/get a user on the backend
  const login = async (userData: any) => {
    if (!userData.role) {
      userData.role = ROLES.STUDENT;
    }
    if (!isValidRole(userData.role)) {
      console.error('Role inválido:', userData.role);
      return false;
    }

    try {
      const resp = await fetch(`${apiBase.replace(/\/+$/, '')}/api/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const json = await resp.json();
      if (resp.ok) {
        setUser(json.user);
        return true;
      }
      console.error('API guest login error', json);
      return false;
    } catch (err) {
      console.error('API guest login failed', err);
      return false;
    }
  };

  const loginWithCredentials = async (email: string, password?: string) => {
    try {
      const resp = await fetch(`${apiBase.replace(/\/+$/, '')}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await resp.json();
      if (resp.ok) {
        setUser(json.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('API login failed', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updates };
      setUser(newUser);
      // persist current user locally for session
      saveCurrentUser(newUser);
    }
  };

  const checkPermission = (permission: string) => {
    if (!user || !(user as any).role) return false;
    return rolesHasPermission((user as any).role, permission);
  };

  const checkRouteAccess = (route: string) => {
    if (!user || !(user as any).role) return false;
    return rolesCanAccessRoute((user as any).role, route);
  };

  const getHomeRoute = () => {
    if (!user || !(user as any).role) return '/dashboard';
    return getDefaultRoute((user as any).role);
  };

  const userRole = (user as any)?.role || null;

  const isStudent = (user as any)?.role === ROLES.STUDENT;
  const isCompany = (user as any)?.role === ROLES.COMPANY;
  const isMentor = (user as any)?.role === ROLES.MENTOR;
  const isAdmin = (user as any)?.role === ROLES.ADMIN;

  return (
    <UserContext.Provider
      value={{
        user,
        registerUser,
        loginWithCredentials,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        // legacy/permission helpers kept for compatibility
        hasPermission: checkPermission,
        canAccessRoute: checkRouteAccess,
        getHomeRoute,
        userRole,
        isStudent,
        isCompany,
        isMentor,
        isAdmin,
      } as any}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
