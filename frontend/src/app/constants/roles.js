/**
 * Sistema de Hierarquia e Permissões de Usuários
 * 
 * Define os roles (funções) disponíveis no sistema e suas permissões
 */

// Roles disponíveis no sistema
export const ROLES = {
  STUDENT: 'STUDENT',         // Estudante/Candidato
  COMPANY: 'COMPANY',         // Empresa/Recrutador
  COURSE_PROVIDER: 'COURSE_PROVIDER', // Empresa Prestadora de Cursos Online Gratuitos
  ADMIN: 'ADMIN',             // Administrador
};

// Labels em português para os roles
export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Estudante',
  [ROLES.COMPANY]: 'Empresa / Recrutador',
  [ROLES.COURSE_PROVIDER]: 'Empresa de Cursos Online',
  [ROLES.ADMIN]: 'Administrador',
};

// Descrições dos roles
export const ROLE_DESCRIPTIONS = {
  [ROLES.STUDENT]: 'Acesso a cursos, vagas, trilha de aprendizado, alertas e gamificação',
  [ROLES.COMPANY]: 'Gestão de vagas, visualização de candidatos e métricas de recrutamento',
  [ROLES.COURSE_PROVIDER]: 'Gestão e oferta de cursos online gratuitos para estudantes',
  [ROLES.ADMIN]: 'Acesso total ao sistema e gerenciamento de usuários',
};

// Permissões disponíveis no sistema
export const PERMISSIONS = {
  // Dashboard e navegação
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_COURSES: 'VIEW_COURSES',
  VIEW_JOBS: 'VIEW_JOBS',
  VIEW_ALERTS: 'VIEW_ALERTS',
  VIEW_TIMELINE: 'VIEW_TIMELINE',
  VIEW_COMPANIES: 'VIEW_COMPANIES',
  VIEW_PROFILE: 'VIEW_PROFILE',
  VIEW_METRICS: 'VIEW_METRICS',
  VIEW_GAMIFICATION: 'VIEW_GAMIFICATION',
  VIEW_MENTORSHIP: 'VIEW_MENTORSHIP',
  VIEW_SUPPORT: 'VIEW_SUPPORT',
  VIEW_SETTINGS: 'VIEW_SETTINGS',
  
  // Cursos
  ENROLL_COURSES: 'ENROLL_COURSES',
  CREATE_COURSES: 'CREATE_COURSES',
  EDIT_COURSES: 'EDIT_COURSES',
  DELETE_COURSES: 'DELETE_COURSES',
  
  // Vagas
  APPLY_JOBS: 'APPLY_JOBS',
  CREATE_JOBS: 'CREATE_JOBS',
  EDIT_JOBS: 'EDIT_JOBS',
  DELETE_JOBS: 'DELETE_JOBS',
  VIEW_CANDIDATES: 'VIEW_CANDIDATES',
  MANAGE_CANDIDATES: 'MANAGE_CANDIDATES',
  
  // Mentoria
  REQUEST_MENTORSHIP: 'REQUEST_MENTORSHIP',
  PROVIDE_MENTORSHIP: 'PROVIDE_MENTORSHIP',
  MANAGE_MENTEES: 'MANAGE_MENTEES',
  
  // Administração
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_SYSTEM: 'MANAGE_SYSTEM',
  VIEW_ALL_DATA: 'VIEW_ALL_DATA',
  MANAGE_COMPANIES: 'MANAGE_COMPANIES',
};

// Mapeamento de permissões por role
export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.VIEW_TIMELINE,
    PERMISSIONS.VIEW_COMPANIES,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.VIEW_METRICS,
    PERMISSIONS.VIEW_GAMIFICATION,
    PERMISSIONS.VIEW_MENTORSHIP,
    PERMISSIONS.VIEW_SUPPORT,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.ENROLL_COURSES,
    PERMISSIONS.APPLY_JOBS,
    PERMISSIONS.REQUEST_MENTORSHIP,
  ],
  
  [ROLES.COMPANY]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.VIEW_METRICS,
    PERMISSIONS.VIEW_SUPPORT,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.CREATE_JOBS,
    PERMISSIONS.EDIT_JOBS,
    PERMISSIONS.DELETE_JOBS,
    PERMISSIONS.VIEW_CANDIDATES,
    PERMISSIONS.MANAGE_CANDIDATES,
  ],
  
  [ROLES.COURSE_PROVIDER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.VIEW_METRICS,
    PERMISSIONS.VIEW_SUPPORT,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.CREATE_COURSES,
    PERMISSIONS.EDIT_COURSES,
    PERMISSIONS.DELETE_COURSES,
  ],
  
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin tem todas as permissões
};

// Rotas permitidas por role
export const ROLE_ROUTES = {
  [ROLES.STUDENT]: [
    '/dashboard',
    '/cursos',
    '/vagas',
    '/alertas',
    '/linha-do-tempo',
    '/empresas',
    '/perfil',
    '/metricas',
    '/gamificacao',
    '/mentoria',
    '/suporte',
    '/configuracoes',
  ],
  
  [ROLES.COMPANY]: [
    '/dashboard',
    '/vagas',
    '/candidatos',
    '/perfil',
    '/metricas',
    '/suporte',
    '/configuracoes',
  ],
  
  [ROLES.COURSE_PROVIDER]: [
    '/dashboard',
    '/cursos',
    '/financeiro',
    '/indicacoes',
    '/perfil',
    '/metricas',
    '/suporte',
    '/configuracoes',
  ],
  
  [ROLES.ADMIN]: [
    '/dashboard',
    '/cursos',
    '/vagas',
    '/alertas',
    '/linha-do-tempo',
    '/empresas',
    '/perfil',
    '/metricas',
    '/gamificacao',
    '/mentoria',
    '/suporte',
    '/financeiro',
    '/indicacoes',
    '/configuracoes',
    '/admin',
    '/usuarios',
    '/sistema',
  ],
};

/**
 * Verifica se um role tem uma permissão específica
 * @param {string} role - Role do usuário
 * @param {string} permission - Permissão a verificar
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Verifica se um role pode acessar uma rota específica
 * @param {string} role - Role do usuário
 * @param {string} route - Rota a verificar
 * @returns {boolean}
 */
export function canAccessRoute(role, route) {
  if (!role || !route) return false;
  const allowedRoutes = ROLE_ROUTES[role] || [];
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
}

/**
 * Retorna todas as rotas permitidas para um role
 * @param {string} role - Role do usuário
 * @returns {string[]}
 */
export function getAllowedRoutes(role) {
  return ROLE_ROUTES[role] || [];
}

/**
 * Retorna a rota inicial padrão para cada role
 * @param {string} role - Role do usuário
 * @returns {string}
 */
export function getDefaultRoute(role) {
  const defaultRoutes = {
    [ROLES.STUDENT]: '/dashboard',
    [ROLES.COMPANY]: '/vagas',
    [ROLES.COURSE_PROVIDER]: '/cursos',
    [ROLES.ADMIN]: '/dashboard',
  };
  
  return defaultRoutes[role] || '/dashboard';
}

/**
 * Valida se um role é válido
 * @param {string} role - Role a validar
 * @returns {boolean}
 */
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}