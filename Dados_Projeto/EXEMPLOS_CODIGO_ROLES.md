# Exemplos de Código - Sistema de Hierarquia

## Índice
1. [Verificar Permissões em Componentes](#1-verificar-permissões-em-componentes)
2. [Proteger Rotas](#2-proteger-rotas)
3. [Renderização Condicional](#3-renderização-condicional)
4. [Hooks Personalizados](#4-hooks-personalizados)
5. [Componentes de Proteção](#5-componentes-de-proteção)
6. [Verificações no UserContext](#6-verificações-no-usercontext)

---

## 1. Verificar Permissões em Componentes

### Exemplo Básico
```jsx
import { useUser } from '@/app/contexts/UserContext';
import { PERMISSIONS } from '@/app/constants/roles';

function JobsPage() {
  const { hasPermission } = useUser();

  return (
    <div>
      <h1>Vagas</h1>
      
      {/* Mostrar botão apenas para quem pode criar vagas */}
      {hasPermission(PERMISSIONS.CREATE_JOBS) && (
        <Button onClick={handleCreateJob}>
          Criar Nova Vaga
        </Button>
      )}

      {/* Mostrar botão apenas para quem pode se candidatar */}
      {hasPermission(PERMISSIONS.APPLY_JOBS) && (
        <Button onClick={handleApply}>
          Candidatar-se
        </Button>
      )}
    </div>
  );
}
```

### Múltiplas Permissões
```jsx
import { useUser } from '@/app/contexts/UserContext';
import { PERMISSIONS } from '@/app/constants/roles';

function CoursesPage() {
  const { hasPermission } = useUser();

  const canManageCourses = 
    hasPermission(PERMISSIONS.CREATE_COURSES) &&
    hasPermission(PERMISSIONS.EDIT_COURSES) &&
    hasPermission(PERMISSIONS.DELETE_COURSES);

  return (
    <div>
      <h1>Cursos</h1>
      
      {canManageCourses && (
        <div className="admin-panel">
          <Button>Criar Curso</Button>
          <Button>Editar Curso</Button>
          <Button>Excluir Curso</Button>
        </div>
      )}

      {hasPermission(PERMISSIONS.ENROLL_COURSES) && (
        <Button>Inscrever-se no Curso</Button>
      )}
    </div>
  );
}
```

---

## 2. Proteger Rotas

### Proteção Simples (Apenas Autenticado)
```jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '@/app/contexts/UserContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Uso no App.jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Proteção por Role
```jsx
import { RoleBasedRoute } from '@/app/components/RoleBasedRoute';
import { ROLES } from '@/app/constants/roles';

// Apenas ADMIN e COMPANY podem acessar
<Route 
  path="/candidatos" 
  element={
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.COMPANY]}>
      <CandidatesPage />
    </RoleBasedRoute>
  } 
/>

// Apenas MENTOR e ADMIN podem acessar
<Route 
  path="/alunos" 
  element={
    <RoleBasedRoute allowedRoles={[ROLES.MENTOR, ROLES.ADMIN]}>
      <StudentsPage />
    </RoleBasedRoute>
  } 
/>
```

### Proteção por Permissão Específica
```jsx
import { RoleBasedRoute } from '@/app/components/RoleBasedRoute';
import { PERMISSIONS } from '@/app/constants/roles';

<Route 
  path="/criar-vaga" 
  element={
    <RoleBasedRoute requiredPermission={PERMISSIONS.CREATE_JOBS}>
      <CreateJobPage />
    </RoleBasedRoute>
  } 
/>
```

### Proteção com Redirecionamento
```jsx
import { RoleBasedRoute } from '@/app/components/RoleBasedRoute';
import { ROLES } from '@/app/constants/roles';

<Route 
  path="/admin" 
  element={
    <RoleBasedRoute 
      allowedRoles={[ROLES.ADMIN]}
      redirectTo="/dashboard"
    >
      <AdminPage />
    </RoleBasedRoute>
  } 
/>
```

---

## 3. Renderização Condicional

### Por Role
```jsx
import { useUser } from '@/app/contexts/UserContext';

function Dashboard() {
  const { isStudent, isCompany, isMentor, isAdmin } = useUser();

  return (
    <div>
      {isStudent && <StudentDashboard />}
      {isCompany && <CompanyDashboard />}
      {isMentor && <MentorDashboard />}
      {isAdmin && <AdminDashboard />}
    </div>
  );
}
```

### Por Role com Switch
```jsx
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';

function Dashboard() {
  const { userRole } = useUser();

  switch (userRole) {
    case ROLES.STUDENT:
      return <StudentDashboard />;
    case ROLES.COMPANY:
      return <CompanyDashboard />;
    case ROLES.MENTOR:
      return <MentorDashboard />;
    case ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <Navigate to="/" />;
  }
}
```

### Com Componentes de Proteção
```jsx
import { RoleGate, PermissionGate } from '@/app/components/RoleBasedRoute';
import { ROLES, PERMISSIONS } from '@/app/constants/roles';

function JobsPage() {
  return (
    <div>
      <h1>Vagas</h1>

      {/* Mostrar apenas para estudantes */}
      <RoleGate roles={ROLES.STUDENT}>
        <JobApplicationForm />
      </RoleGate>

      {/* Mostrar apenas para empresas e admins */}
      <RoleGate roles={[ROLES.COMPANY, ROLES.ADMIN]}>
        <JobManagementPanel />
      </RoleGate>

      {/* Mostrar baseado em permissão */}
      <PermissionGate permission={PERMISSIONS.VIEW_CANDIDATES}>
        <CandidatesList />
      </PermissionGate>
    </div>
  );
}
```

---

## 4. Hooks Personalizados

### usePermission (Verificar Uma Permissão)
```jsx
import { usePermission } from '@/app/components/RoleBasedRoute';
import { PERMISSIONS } from '@/app/constants/roles';

function MyComponent() {
  const canCreateJobs = usePermission(PERMISSIONS.CREATE_JOBS);
  const canEditJobs = usePermission(PERMISSIONS.EDIT_JOBS);
  const canDeleteJobs = usePermission(PERMISSIONS.DELETE_JOBS);

  return (
    <div>
      {canCreateJobs && <Button>Criar</Button>}
      {canEditJobs && <Button>Editar</Button>}
      {canDeleteJobs && <Button>Excluir</Button>}
    </div>
  );
}
```

### usePermissions (Verificar Múltiplas Permissões)
```jsx
import { usePermissions } from '@/app/components/RoleBasedRoute';
import { PERMISSIONS } from '@/app/constants/roles';

function MyComponent() {
  // Requer TODAS as permissões (AND)
  const canFullyManageCourses = usePermissions([
    PERMISSIONS.CREATE_COURSES,
    PERMISSIONS.EDIT_COURSES,
    PERMISSIONS.DELETE_COURSES
  ], true);

  // Requer PELO MENOS UMA permissão (OR)
  const canInteractWithJobs = usePermissions([
    PERMISSIONS.APPLY_JOBS,
    PERMISSIONS.CREATE_JOBS,
    PERMISSIONS.MANAGE_CANDIDATES
  ], false);

  return (
    <div>
      {canFullyManageCourses && <CourseAdminPanel />}
      {canInteractWithJobs && <JobsSection />}
    </div>
  );
}
```

### Hook Personalizado para Verificar Acesso a Rota
```jsx
import { useUser } from '@/app/contexts/UserContext';

function useCanAccessRoute(route) {
  const { canAccessRoute } = useUser();
  return canAccessRoute(route);
}

// Uso
function Navigation() {
  const canAccessCourses = useCanAccessRoute('/cursos');
  const canAccessJobs = useCanAccessRoute('/vagas');

  return (
    <nav>
      {canAccessCourses && <Link to="/cursos">Cursos</Link>}
      {canAccessJobs && <Link to="/vagas">Vagas</Link>}
    </nav>
  );
}
```

---

## 5. Componentes de Proteção

### PermissionGate (Por Permissão)
```jsx
import { PermissionGate } from '@/app/components/RoleBasedRoute';
import { PERMISSIONS } from '@/app/constants/roles';

function JobsPage() {
  return (
    <div>
      <h1>Vagas</h1>

      {/* Exibir apenas se tiver permissão */}
      <PermissionGate permission={PERMISSIONS.CREATE_JOBS}>
        <CreateJobButton />
      </PermissionGate>

      {/* Com fallback */}
      <PermissionGate 
        permission={PERMISSIONS.VIEW_CANDIDATES}
        fallback={<p>Você não tem permissão para ver candidatos</p>}
      >
        <CandidatesList />
      </PermissionGate>
    </div>
  );
}
```

### RoleGate (Por Role)
```jsx
import { RoleGate } from '@/app/components/RoleBasedRoute';
import { ROLES } from '@/app/constants/roles';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Para estudantes */}
      <RoleGate roles={ROLES.STUDENT}>
        <StudentStats />
      </RoleGate>

      {/* Para empresas OU admins */}
      <RoleGate roles={[ROLES.COMPANY, ROLES.ADMIN]}>
        <RecruitmentStats />
      </RoleGate>

      {/* Com fallback */}
      <RoleGate 
        roles={ROLES.MENTOR}
        fallback={<p>Disponível apenas para mentores</p>}
      >
        <MentorshipPanel />
      </RoleGate>
    </div>
  );
}
```

### Componente Personalizado de Proteção
```jsx
// FeatureGate.jsx
import { useUser } from '@/app/contexts/UserContext';

export function FeatureGate({ feature, children, fallback = null }) {
  const { user } = useUser();

  // Lógica personalizada baseada em features
  const features = {
    gamification: user?.role === 'STUDENT',
    recruitment: ['COMPANY', 'ADMIN'].includes(user?.role),
    mentorship: ['STUDENT', 'MENTOR', 'ADMIN'].includes(user?.role),
  };

  const hasFeature = features[feature] || false;

  if (!hasFeature) {
    return fallback;
  }

  return <>{children}</>;
}

// Uso
<FeatureGate feature="gamification">
  <GamificationPanel />
</FeatureGate>
```

---

## 6. Verificações no UserContext

### Obter Informações do Usuário
```jsx
import { useUser } from '@/app/contexts/UserContext';

function ProfilePage() {
  const { 
    user,              // Objeto completo do usuário
    userRole,          // Role atual ('STUDENT', 'COMPANY', etc)
    isAuthenticated,   // Boolean: está logado?
    isStudent,         // Boolean: é estudante?
    isCompany,         // Boolean: é empresa?
    isMentor,          // Boolean: é mentor?
    isAdmin,           // Boolean: é admin?
  } = useUser();

  return (
    <div>
      <h1>Perfil de {user?.name}</h1>
      <p>E-mail: {user?.email}</p>
      <p>Tipo de conta: {userRole}</p>
      
      {isStudent && <p>Pontos: {user?.points}</p>}
      {isCompany && <p>Empresa: {user?.companyName}</p>}
      {isMentor && <p>Experiência: {user?.yearsExperience} anos</p>}
      {isAdmin && <p>Acesso Total</p>}
    </div>
  );
}
```

### Verificar Permissão
```jsx
import { useUser } from '@/app/contexts/UserContext';

function JobCard({ job }) {
  const { hasPermission } = useUser();

  const canApply = hasPermission('APPLY_JOBS');
  const canEdit = hasPermission('EDIT_JOBS');
  const canDelete = hasPermission('DELETE_JOBS');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {canApply && <Button>Candidatar-se</Button>}
        {canEdit && <Button>Editar</Button>}
        {canDelete && <Button>Excluir</Button>}
      </CardContent>
    </Card>
  );
}
```

### Obter Rota Inicial
```jsx
import { useUser } from '@/app/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const { getHomeRoute } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // ... lógica de login
    const homeRoute = getHomeRoute();
    navigate(homeRoute); // Redireciona para a rota inicial do role
  };

  return <Button onClick={handleLogin}>Entrar</Button>;
}
```

### Atualizar Dados do Usuário
```jsx
import { useUser } from '@/app/contexts/UserContext';

function ProfileEditForm() {
  const { user, updateUser } = useUser();

  const handleSubmit = (formData) => {
    updateUser({
      name: formData.name,
      email: formData.email,
      // role não pode ser alterado via updateUser
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## Exemplos Completos de Páginas

### Página de Vagas (Com Múltiplas Permissões)
```jsx
import React from 'react';
import { useUser } from '@/app/contexts/UserContext';
import { PERMISSIONS } from '@/app/constants/roles';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { PermissionGate } from '@/app/components/RoleBasedRoute';

export function JobsPage() {
  const { hasPermission, isStudent, isCompany } = useUser();

  return (
    <div className="space-y-6">
      {/* Header com botão de criar (apenas para empresas) */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vagas</h1>
        
        <PermissionGate permission={PERMISSIONS.CREATE_JOBS}>
          <Button>Criar Nova Vaga</Button>
        </PermissionGate>
      </div>

      {/* Filtros (apenas para estudantes) */}
      {isStudent && (
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Filtros</h2>
          {/* Filtros aqui */}
        </div>
      )}

      {/* Lista de vagas */}
      <div className="grid gap-4">
        {jobs.map(job => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              {/* Botões baseados em permissões */}
              {hasPermission(PERMISSIONS.APPLY_JOBS) && (
                <Button>Candidatar-se</Button>
              )}
              
              {hasPermission(PERMISSIONS.EDIT_JOBS) && (
                <Button variant="outline">Editar</Button>
              )}
              
              {hasPermission(PERMISSIONS.VIEW_CANDIDATES) && (
                <Button variant="outline">Ver Candidatos</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Painel de gerenciamento (apenas para empresas) */}
      {isCompany && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Minhas Vagas</h2>
          {/* Lista de vagas da empresa */}
        </div>
      )}
    </div>
  );
}
```

### Dashboard Adaptável por Role
```jsx
import React from 'react';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';

export function Dashboard() {
  const { userRole, user } = useUser();

  const renderDashboard = () => {
    switch (userRole) {
      case ROLES.STUDENT:
        return (
          <div className="space-y-6">
            <h1>Bem-vindo, {user?.name}!</h1>
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Pontos" value={user?.points} />
              <StatCard title="Cursos" value={user?.completedCourses?.length} />
              <StatCard title="Candidaturas" value={user?.appliedJobs?.length} />
            </div>
            <LearningPathSection />
            <RecommendedCoursesSection />
          </div>
        );

      case ROLES.COMPANY:
        return (
          <div className="space-y-6">
            <h1>Dashboard - {user?.companyName}</h1>
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Vagas Ativas" value={user?.activeJobs?.length} />
              <StatCard title="Candidatos" value={0} />
              <StatCard title="Contratações" value={user?.hiredCandidates?.length} />
            </div>
            <ActiveJobsSection />
            <CandidatesSection />
          </div>
        );

      case ROLES.MENTOR:
        return (
          <div className="space-y-6">
            <h1>Dashboard de Mentoria - {user?.name}</h1>
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Mentorados" value={user?.mentees?.length} />
              <StatCard title="Sessões" value={user?.totalSessions} />
              <StatCard title="Avaliação" value={user?.rating} />
            </div>
            <MenteesSection />
            <UpcomingSessionsSection />
          </div>
        );

      case ROLES.ADMIN:
        return (
          <div className="space-y-6">
            <h1>Painel Administrativo</h1>
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Usuários" value={0} />
              <StatCard title="Cursos" value={0} />
              <StatCard title="Vagas" value={0} />
              <StatCard title="Empresas" value={0} />
            </div>
            <SystemOverviewSection />
            <UserManagementSection />
          </div>
        );

      default:
        return <div>Tipo de usuário não reconhecido</div>;
    }
  };

  return <div className="container py-6">{renderDashboard()}</div>;
}
```

---

## Dicas e Boas Práticas

### ✅ FAÇA
- Use hooks para verificar permissões
- Combine múltiplas verificações quando necessário
- Forneça feedback claro quando acesso for negado
- Use componentes de proteção para legibilidade
- Documente permissões necessárias em comentários

### ❌ NÃO FAÇA
- Não confie apenas em verificações frontend (sempre valide no backend)
- Não esconda apenas com CSS (use renderização condicional)
- Não duplique lógica de permissões (centralize em constants/roles.js)
- Não deixe de tratar casos de erro
- Não exponha informações sensíveis baseado apenas em UI

---

**Última atualização:** 21 de Janeiro de 2026
