import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, hasPermission, canAccessRoute, getDefaultRoute, isValidRole } from '@/app/constants/roles';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

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
      // Não permitir mudança de role através do updateUser
      if (updates.role && updates.role !== user.role) {
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