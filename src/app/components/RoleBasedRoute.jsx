import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/app/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

/**
 * Componente para proteger rotas baseado em roles/permissões
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado se tiver acesso
 * @param {string[]} props.allowedRoles - Roles permitidos para acessar a rota
 * @param {string} props.requiredPermission - Permissão específica necessária
 * @param {string} props.redirectTo - Rota para redirecionar se não tiver acesso
 */
export function RoleBasedRoute({ 
  children, 
  allowedRoles = [], 
  requiredPermission = null,
  redirectTo = null 
}) {
  const { isAuthenticated, userRole, hasPermission, canAccessRoute, getHomeRoute } = useUser();
  const location = useLocation();

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Verificar se o role está na lista de permitidos
  const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // Verificar se tem a permissão específica (se foi especificada)
  const hasRequiredPermission = !requiredPermission || hasPermission(requiredPermission);

  // Verificar se pode acessar a rota atual
  const canAccess = canAccessRoute(location.pathname);

  // Se não tiver acesso, mostrar página de acesso negado ou redirecionar
  if (!hasAllowedRole || !hasRequiredPermission || !canAccess) {
    // Se especificou um redirect, usar ele
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Caso contrário, mostrar página de acesso negado
    return <AccessDeniedPage />;
  }

  // Se tiver acesso, renderizar o conteúdo
  return <>{children}</>;
}

/**
 * Página de Acesso Negado
 */
function AccessDeniedPage() {
  const { getHomeRoute } = useUser();
  const homeRoute = getHomeRoute();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">
            Acesso Negado
          </CardTitle>
          <CardDescription className="text-base">
            Você não tem permissão para acessar esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Esta página requer permissões específicas que não estão disponíveis para o seu tipo de conta.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => window.location.href = homeRoute}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar para Página Inicial
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Hook para verificar permissões em componentes
 * 
 * @param {string} permission - Permissão a verificar
 * @returns {boolean}
 */
export function usePermission(permission) {
  const { hasPermission } = useUser();
  return hasPermission(permission);
}

/**
 * Hook para verificar múltiplas permissões
 * 
 * @param {string[]} permissions - Array de permissões
 * @param {boolean} requireAll - Se true, requer todas as permissões. Se false, requer pelo menos uma
 * @returns {boolean}
 */
export function usePermissions(permissions, requireAll = true) {
  const { hasPermission } = useUser();
  
  if (requireAll) {
    return permissions.every(permission => hasPermission(permission));
  } else {
    return permissions.some(permission => hasPermission(permission));
  }
}

/**
 * Componente para renderizar conteúdo baseado em permissão
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo a renderizar se tiver permissão
 * @param {string} props.permission - Permissão necessária
 * @param {React.ReactNode} props.fallback - Conteúdo alternativo se não tiver permissão
 */
export function PermissionGate({ children, permission, fallback = null }) {
  const hasRequiredPermission = usePermission(permission);
  
  if (!hasRequiredPermission) {
    return fallback;
  }
  
  return <>{children}</>;
}

/**
 * Componente para renderizar conteúdo baseado em role
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo a renderizar se tiver o role
 * @param {string|string[]} props.roles - Role(s) permitido(s)
 * @param {React.ReactNode} props.fallback - Conteúdo alternativo se não tiver o role
 */
export function RoleGate({ children, roles, fallback = null }) {
  const { userRole } = useUser();
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = allowedRoles.includes(userRole);
  
  if (!hasRole) {
    return fallback;
  }
  
  return <>{children}</>;
}
