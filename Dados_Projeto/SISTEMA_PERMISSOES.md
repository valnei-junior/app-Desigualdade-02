# Sistema de Hierarquia e Permissões de Usuários

## Visão Geral

O sistema possui 4 tipos de usuários (roles) com permissões e acessos diferenciados:

1. **Estudante (STUDENT)** - Usuário padrão da plataforma
2. **Empresa/Recrutador (COMPANY)** - Gestão de vagas e candidatos
3. **Mentor/Professor (MENTOR)** - Mentoria e acompanhamento de alunos
4. **Administrador (ADMIN)** - Acesso total ao sistema

---

## Tipos de Usuários (Roles)

### 1. Estudante (STUDENT)
**Descrição:** Acesso a cursos, vagas, trilha de aprendizado, alertas e gamificação

**Dados do Cadastro:**
- Nome completo
- E-mail
- Senha
- Idade
- Área de interesse
- Nível de escolaridade
- Currículo (opcional)

**Funcionalidades Disponíveis:**
- ✅ Dashboard com trilha de aprendizado
- ✅ Buscar e inscrever-se em cursos
- ✅ Buscar e candidatar-se a vagas
- ✅ Criar e gerenciar alertas personalizados
- ✅ Visualizar linha do tempo de atividades
- ✅ Explorar empresas parceiras
- ✅ Gerenciar perfil pessoal
- ✅ Visualizar métricas de progresso
- ✅ Sistema de gamificação (pontos e badges)
- ✅ Solicitar mentoria
- ✅ Acessar suporte e FAQ
- ✅ Configurações da conta

**Rotas Permitidas:**
- `/dashboard` - Dashboard principal
- `/cursos` - Catálogo de cursos
- `/vagas` - Busca de vagas
- `/alertas` - Alertas personalizados
- `/linha-do-tempo` - Timeline de atividades
- `/empresas` - Empresas parceiras
- `/perfil` - Perfil do usuário
- `/metricas` - Métricas e estatísticas
- `/gamificacao` - Pontos e badges
- `/mentoria` - Sessões de mentoria (como mentorado)
- `/suporte` - Central de ajuda
- `/configuracoes` - Configurações

---

### 2. Empresa/Recrutador (COMPANY)
**Descrição:** Gestão de vagas, visualização de candidatos e métricas de recrutamento

**Dados do Cadastro:**
- Nome do responsável
- E-mail
- Senha
- Nome da empresa
- Tamanho da empresa
- Setor de atuação

**Funcionalidades Disponíveis:**
- ✅ Dashboard com métricas de recrutamento
- ✅ Criar, editar e excluir vagas
- ✅ Visualizar candidatos inscritos
- ✅ Gerenciar candidaturas
- ✅ Perfil empresarial
- ✅ Métricas de contratação
- ✅ Suporte
- ✅ Configurações da conta

**Rotas Permitidas:**
- `/dashboard` - Dashboard de vagas
- `/vagas` - Gestão de vagas
- `/candidatos` - Visualização de candidatos (a ser implementado)
- `/perfil` - Perfil da empresa
- `/metricas` - Métricas de recrutamento
- `/suporte` - Central de ajuda
- `/configuracoes` - Configurações

**Funcionalidades Restritas:**
- ❌ Não pode se inscrever em cursos
- ❌ Não pode se candidatar a vagas
- ❌ Não tem acesso a gamificação
- ❌ Não pode solicitar mentoria

---

### 3. Mentor/Professor (MENTOR)
**Descrição:** Acompanhamento de alunos, sessões de mentoria e feedback

**Dados do Cadastro:**
- Nome completo
- E-mail
- Senha
- Área de especialidade
- Anos de experiência

**Funcionalidades Disponíveis:**
- ✅ Dashboard com visão de mentorados
- ✅ Visualizar cursos da plataforma
- ✅ Gerenciar sessões de mentoria
- ✅ Acompanhar progresso dos alunos
- ✅ Perfil profissional
- ✅ Métricas de mentoria
- ✅ Suporte
- ✅ Configurações da conta

**Rotas Permitidas:**
- `/dashboard` - Dashboard de mentoria
- `/mentoria` - Gestão de mentorias (como mentor)
- `/alunos` - Lista de mentorados (a ser implementado)
- `/cursos` - Visualização de cursos
- `/perfil` - Perfil do mentor
- `/metricas` - Métricas de mentoria
- `/suporte` - Central de ajuda
- `/configuracoes` - Configurações

**Funcionalidades Restritas:**
- ❌ Não pode gerenciar vagas
- ❌ Não tem acesso total a candidatos
- ⚠️ Acesso limitado à gamificação

---

### 4. Administrador (ADMIN)
**Descrição:** Acesso total ao sistema e gerenciamento de usuários

**Dados do Cadastro:**
- Nome completo
- E-mail
- Senha
- Departamento

**Funcionalidades Disponíveis:**
- ✅ **ACESSO TOTAL** a todas as funcionalidades
- ✅ Gerenciar todos os usuários
- ✅ Gerenciar sistema
- ✅ Visualizar todos os dados
- ✅ Gerenciar empresas parceiras
- ✅ Criar e editar cursos
- ✅ Moderar conteúdo

**Rotas Permitidas:**
- Todas as rotas do sistema
- `/admin` - Painel administrativo (a ser implementado)
- `/usuarios` - Gestão de usuários (a ser implementado)
- `/sistema` - Configurações do sistema (a ser implementado)

---

## Sistema de Permissões

### Estrutura de Permissões

Cada role possui um conjunto específico de permissões. As permissões são verificadas em:

1. **Nível de Rota** - Controla quais páginas podem ser acessadas
2. **Nível de Componente** - Controla quais elementos são exibidos
3. **Nível de Ação** - Controla quais ações podem ser executadas

### Permissões Disponíveis

#### Navegação e Visualização
- `VIEW_DASHBOARD` - Ver dashboard
- `VIEW_COURSES` - Ver cursos
- `VIEW_JOBS` - Ver vagas
- `VIEW_ALERTS` - Ver alertas
- `VIEW_TIMELINE` - Ver linha do tempo
- `VIEW_COMPANIES` - Ver empresas
- `VIEW_PROFILE` - Ver perfil
- `VIEW_METRICS` - Ver métricas
- `VIEW_GAMIFICATION` - Ver gamificação
- `VIEW_MENTORSHIP` - Ver mentoria
- `VIEW_SUPPORT` - Ver suporte
- `VIEW_SETTINGS` - Ver configurações

#### Cursos
- `ENROLL_COURSES` - Inscrever-se em cursos
- `CREATE_COURSES` - Criar cursos
- `EDIT_COURSES` - Editar cursos
- `DELETE_COURSES` - Deletar cursos

#### Vagas
- `APPLY_JOBS` - Candidatar-se a vagas
- `CREATE_JOBS` - Criar vagas
- `EDIT_JOBS` - Editar vagas
- `DELETE_JOBS` - Deletar vagas
- `VIEW_CANDIDATES` - Ver candidatos
- `MANAGE_CANDIDATES` - Gerenciar candidatos

#### Mentoria
- `REQUEST_MENTORSHIP` - Solicitar mentoria
- `PROVIDE_MENTORSHIP` - Oferecer mentoria
- `MANAGE_MENTEES` - Gerenciar mentorados

#### Administração
- `MANAGE_USERS` - Gerenciar usuários
- `MANAGE_SYSTEM` - Gerenciar sistema
- `VIEW_ALL_DATA` - Ver todos os dados
- `MANAGE_COMPANIES` - Gerenciar empresas

---

## Implementação Técnica

### Arquivos Principais

1. **`/src/app/constants/roles.js`**
   - Define roles, permissões e rotas
   - Funções auxiliares para verificação

2. **`/src/app/contexts/UserContext.jsx`**
   - Gerencia estado do usuário
   - Funções de autenticação
   - Verificação de permissões

3. **`/src/app/components/RoleBasedRoute.jsx`**
   - Componente de proteção de rotas
   - Página de acesso negado
   - Hooks de permissão

4. **`/src/app/components/RegisterPage.jsx`**
   - Cadastro com seleção de role
   - Validações específicas por tipo
   - Campos dinâmicos

### Como Usar

#### 1. Verificar Permissão no Componente

```jsx
import { useUser } from '@/app/contexts/UserContext';
import { PERMISSIONS } from '@/app/constants/roles';

function MyComponent() {
  const { hasPermission } = useUser();

  return (
    <div>
      {hasPermission(PERMISSIONS.CREATE_JOBS) && (
        <Button>Criar Vaga</Button>
      )}
    </div>
  );
}
```

#### 2. Proteger Rota por Role

```jsx
import { RoleBasedRoute } from '@/app/components/RoleBasedRoute';
import { ROLES } from '@/app/constants/roles';

<Route 
  path="/admin" 
  element={
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
      <AdminPage />
    </RoleBasedRoute>
  } 
/>
```

#### 3. Usar Hooks de Permissão

```jsx
import { usePermission, usePermissions } from '@/app/components/RoleBasedRoute';
import { PERMISSIONS } from '@/app/constants/roles';

function MyComponent() {
  const canCreateJobs = usePermission(PERMISSIONS.CREATE_JOBS);
  const canManageCourses = usePermissions([
    PERMISSIONS.CREATE_COURSES,
    PERMISSIONS.EDIT_COURSES,
    PERMISSIONS.DELETE_COURSES
  ], true); // true = requer todas as permissões

  return (
    <div>
      {canCreateJobs && <CreateJobButton />}
      {canManageCourses && <CourseManager />}
    </div>
  );
}
```

#### 4. Componentes de Proteção

```jsx
import { PermissionGate, RoleGate } from '@/app/components/RoleBasedRoute';
import { PERMISSIONS, ROLES } from '@/app/constants/roles';

// Proteger por permissão
<PermissionGate 
  permission={PERMISSIONS.CREATE_JOBS}
  fallback={<p>Sem permissão</p>}
>
  <CreateJobForm />
</PermissionGate>

// Proteger por role
<RoleGate 
  roles={[ROLES.ADMIN, ROLES.COMPANY]}
  fallback={<p>Acesso restrito</p>}
>
  <AdminPanel />
</RoleGate>
```

#### 5. Verificar Informações do Usuário

```jsx
import { useUser } from '@/app/contexts/UserContext';

function MyComponent() {
  const { 
    user, 
    userRole, 
    isStudent, 
    isCompany, 
    isMentor, 
    isAdmin,
    getHomeRoute 
  } = useUser();

  console.log('Role atual:', userRole);
  console.log('É estudante?', isStudent);
  console.log('Rota inicial:', getHomeRoute());

  return <div>Olá, {user?.name}</div>;
}
```

---

## Fluxo de Cadastro

### 1. Página de Cadastro
- Usuário seleciona o tipo de conta (role)
- Formulário exibe campos específicos baseado no role
- Validações são aplicadas conforme o tipo

### 2. Validação
- Campos obrigatórios variam por role
- Senhas devem ter no mínimo 6 caracteres
- E-mail deve ser válido
- Idade mínima de 16 anos (estudantes)

### 3. Criação da Conta
- Usuário é criado com o role selecionado
- Dados são salvos no localStorage
- Redirecionamento para página inicial do role

### 4. Login Automático
- Após cadastro, usuário é logado automaticamente
- Contexto de usuário é atualizado
- Navegação é habilitada baseada nas permissões

---

## Persistência de Dados

### LocalStorage
Os dados do usuário são salvos no localStorage com a chave `currentUser`:

```json
{
  "id": "1234567890",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STUDENT",
  "age": 25,
  "area": "TI",
  "education": "Superior Completo",
  "completedCourses": [],
  "appliedJobs": [],
  "points": 150,
  "badges": ["iniciante"],
  "createdAt": "2026-01-21T12:00:00.000Z"
}
```

### Segurança
⚠️ **IMPORTANTE:** Este é um sistema de demonstração. Em produção:
- Não armazene senhas no frontend
- Use JWT tokens para autenticação
- Implemente backend seguro com API
- Valide permissões no servidor
- Use HTTPS para todas as comunicações

---

## Rotas Protegidas

### Implementação Atual
Todas as rotas dentro de `/` (exceto `/` e `/cadastro`) são protegidas e requerem autenticação.

### Proteção por Role (Planejado)
No futuro, as seguintes rotas terão proteção adicional por role:

- `/candidatos` - Apenas COMPANY e ADMIN
- `/alunos` - Apenas MENTOR e ADMIN
- `/admin` - Apenas ADMIN
- `/usuarios` - Apenas ADMIN
- `/sistema` - Apenas ADMIN

---

## Extensibilidade

### Adicionar Novo Role

1. **Adicione o role em `/src/app/constants/roles.js`:**

```javascript
export const ROLES = {
  STUDENT: 'STUDENT',
  COMPANY: 'COMPANY',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
  NEW_ROLE: 'NEW_ROLE', // Novo role
};
```

2. **Defina label e descrição:**

```javascript
export const ROLE_LABELS = {
  // ... outros roles
  [ROLES.NEW_ROLE]: 'Novo Tipo',
};

export const ROLE_DESCRIPTIONS = {
  // ... outros roles
  [ROLES.NEW_ROLE]: 'Descrição do novo tipo',
};
```

3. **Configure permissões:**

```javascript
export const ROLE_PERMISSIONS = {
  // ... outros roles
  [ROLES.NEW_ROLE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    // ... adicione as permissões necessárias
  ],
};
```

4. **Defina rotas permitidas:**

```javascript
export const ROLE_ROUTES = {
  // ... outros roles
  [ROLES.NEW_ROLE]: [
    '/dashboard',
    '/perfil',
    '/configuracoes',
    // ... adicione as rotas necessárias
  ],
};
```

5. **Atualize o formulário de cadastro em `/src/app/components/RegisterPage.jsx`**

---

## Melhorias Futuras

### Curto Prazo
- [ ] Implementar rota `/candidatos` para empresas
- [ ] Implementar rota `/alunos` para mentores
- [ ] Adicionar validação de e-mail único
- [ ] Implementar recuperação de senha

### Médio Prazo
- [ ] Painel administrativo completo (`/admin`)
- [ ] Gestão de usuários (`/usuarios`)
- [ ] Sistema de auditoria de ações
- [ ] Logs de acesso e permissões

### Longo Prazo
- [ ] Integração com backend
- [ ] Autenticação com JWT
- [ ] OAuth (Google, LinkedIn, etc.)
- [ ] Sistema de roles hierárquico
- [ ] Permissões granulares customizáveis
- [ ] Multi-tenant support

---

## Troubleshooting

### Usuário não consegue acessar uma página

**Verificar:**
1. O usuário está autenticado?
2. O role do usuário está correto?
3. A rota está na lista de rotas permitidas do role?
4. A permissão necessária está atribuída ao role?

**Solução:**
```javascript
// Verificar no console do navegador
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Usuário:', user);
console.log('Role:', user?.role);

// Verificar permissões
import { ROLE_PERMISSIONS } from '@/app/constants/roles';
console.log('Permissões:', ROLE_PERMISSIONS[user?.role]);
```

### Erro ao fazer login

**Verificar:**
1. Os dados do formulário estão corretos?
2. O role é válido?
3. Não há erros no console?

**Solução:**
Limpar localStorage e tentar novamente:
```javascript
localStorage.clear();
window.location.reload();
```

### Página de acesso negado aparece incorretamente

**Verificar:**
1. A função `canAccessRoute` está retornando o valor correto?
2. A rota está configurada corretamente em `ROLE_ROUTES`?

**Solução:**
Adicionar logs para debug:
```javascript
import { canAccessRoute } from '@/app/constants/roles';
console.log('Pode acessar?', canAccessRoute(user.role, '/sua-rota'));
```

---

## Suporte

Para dúvidas ou problemas com o sistema de permissões:

1. Consulte este documento
2. Verifique os arquivos de implementação
3. Teste no ambiente de desenvolvimento
4. Documente o problema e a solução

---

**Última atualização:** 21 de Janeiro de 2026  
**Versão:** 1.0.0  
**Autor:** Sistema de Hierarquia e Permissões
