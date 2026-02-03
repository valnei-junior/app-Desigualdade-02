import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, hasPermission, canAccessRoute, getDefaultRoute, isValidRole } from '@/app/constants/roles';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const apiBase = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:4000';

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Salvar usuário no localStorage quando mudar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const registerUser = async (userData, password) => {
    try {
      const resp = await fetch(`${apiBase.replace(/\/+$/, '')}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, password }),
      });
      let json = null;
      try { json = await resp.json(); } catch {}
      if (resp.ok) {
        setUser(json.user);
        try {
          const key = 'admin_users';
          const raw = localStorage.getItem(key);
          const list = raw ? JSON.parse(raw) : [];
          const next = list.some((u) => u.email === json.user.email)
            ? list.map((u) => (u.email === json.user.email ? json.user : u))
            : [...list, json.user];
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return { ok: true };
      }
      console.error('API register error', json);
      return { ok: false, error: json?.error || 'Não foi possível criar a conta. Verifique os dados.' };
    } catch (err) {
      console.error('API register failed', err);
      return { ok: false, error: 'Servidor indisponível. Verifique se o backend está rodando.' };
    }
  };

  const loginWithCredentials = async (email, password) => {
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

  const login = (userData) => {
    // Validar role antes de fazer login
    if (!userData.role) {
      userData.role = ROLES.STUDENT; // Role padrão
    }
    
    if (!isValidRole(userData.role)) {
      console.error('Role inválido:', userData.role);
      return false;
    }

    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  const updateUser = (updates) => {
    if (user) {
      // Permitir definir role apenas se o usuário ainda não tiver um
      if (updates.role && user.role && updates.role !== user.role) {
        console.warn('Não é permitido mudar o role através de updateUser');
        delete updates.role;
      }
      setUser({ ...user, ...updates });
    }
  };

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const checkPermission = (permission) => {
    if (!user || !user.role) return false;
    return hasPermission(user.role, permission);
  };

  /**
   * Verifica se o usuário pode acessar uma rota
   */
  const checkRouteAccess = (route) => {
    if (!user || !user.role) return false;
    return canAccessRoute(user.role, route);
  };

  /**
   * Retorna a rota inicial do usuário baseada no seu role
   */
  const getHomeRoute = () => {
    if (!user || !user.role) return '/dashboard';
    return getDefaultRoute(user.role);
  };

  const value = {
    user,
    login,
    registerUser,
    loginWithCredentials,
    logout,
    updateUser,
    isAuthenticated: !!user,
    // Funções de permissão
    hasPermission: checkPermission,
    canAccessRoute: checkRouteAccess,
    getHomeRoute,
    // Informações do role
    userRole: user?.role || null,
    isStudent: user?.role === ROLES.STUDENT,
    isCompany: user?.role === ROLES.COMPANY,
    isMentor: user?.role === ROLES.MENTOR,
    isAdmin: user?.role === ROLES.ADMIN,
  };

  return (
    <UserContext.Provider value={value}>
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