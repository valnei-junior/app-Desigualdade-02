# Como Testar o Sistema de Hierarquia de Acesso

## Criando Contas de Teste

### 1. Conta de Estudante
1. Acesse a página inicial
2. Clique em "Cadastrar"
3. Selecione **"Estudante"**
4. Preencha:
   - Nome: João Silva
   - E-mail: joao@teste.com
   - Senha: 123456
   - Confirmar Senha: 123456
   - Idade: 25
   - Área de interesse: Tecnologia da Informação
   - Escolaridade: Superior Completo
5. Clique em "Criar Conta"

**Acesso esperado:**
- ✅ Dashboard
- ✅ Cursos
- ✅ Vagas
- ✅ Alertas
- ✅ Linha do Tempo
- ✅ Empresas
- ✅ Perfil
- ✅ Métricas
- ✅ Gamificação
- ✅ Mentoria
- ✅ Suporte

### 2. Conta de Empresa/Recrutador
1. Acesse a página inicial
2. Clique em "Cadastrar"
3. Selecione **"Empresa / Recrutador"**
4. Preencha:
   - Nome do Responsável: Maria Santos
   - E-mail: maria@empresa.com
   - Senha: 123456
   - Confirmar Senha: 123456
   - Nome da Empresa: TechCorp
   - Tamanho: 51-200 funcionários
   - Setor: Tecnologia
5. Clique em "Criar Conta"

**Acesso esperado:**
- ✅ Dashboard
- ✅ Vagas
- ✅ Perfil
- ✅ Métricas
- ✅ Suporte
- ❌ Cursos (restrito)
- ❌ Alertas (restrito)
- ❌ Gamificação (restrito)

### 3. Conta de Mentor/Professor
1. Acesse a página inicial
2. Clique em "Cadastrar"
3. Selecione **"Mentor / Professor"**
4. Preencha:
   - Nome: Carlos Oliveira
   - E-mail: carlos@mentor.com
   - Senha: 123456
   - Confirmar Senha: 123456
   - Área de Especialidade: Tecnologia da Informação
   - Anos de Experiência: 10
5. Clique em "Criar Conta"

**Acesso esperado:**
- ✅ Dashboard
- ✅ Mentoria
- ✅ Cursos
- ✅ Perfil
- ✅ Métricas
- ✅ Suporte
- ❌ Vagas (restrito)
- ❌ Gamificação (restrito)

### 4. Conta de Administrador
1. Acesse a página inicial
2. Clique em "Cadastrar"
3. Selecione **"Administrador"**
4. Preencha:
   - Nome: Admin Sistema
   - E-mail: admin@sistema.com
   - Senha: 123456
   - Confirmar Senha: 123456
   - Departamento: Administração Geral
5. Clique em "Criar Conta"

**Acesso esperado:**
- ✅ ACESSO TOTAL A TODAS AS PÁGINAS

---

## Verificando o Sistema de Permissões

### 1. Verificar Badge de Role
Após fazer login, observe:
- **Mobile:** Abra o menu lateral (☰) - o badge aparece ao lado do nome
- **Desktop:** O badge aparece no card do sidebar à esquerda

### 2. Verificar Navegação Filtrada
- Apenas as páginas permitidas para o seu role aparecerão no menu
- Se tentar acessar uma rota não permitida diretamente pela URL, verá a página de "Acesso Negado"

### 3. Testar Acesso Negado
1. Faça login como **Empresa**
2. Tente acessar manualmente: `http://localhost:5173/gamificacao`
3. Você verá a página de "Acesso Negado" com botão para voltar

### 4. Alternar Entre Contas
1. Faça logout da conta atual
2. Faça login com outro tipo de conta
3. Observe as diferenças na navegação e acessos

---

## Verificando Dados no LocalStorage

Abra o Console do navegador (F12) e execute:

```javascript
// Ver dados do usuário atual
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('Usuário:', user);
console.log('Role:', user?.role);

// Ver todas as permissões do role
import { ROLE_PERMISSIONS } from './src/app/constants/roles.js';
console.log('Permissões:', ROLE_PERMISSIONS[user?.role]);
```

---

## Limpando Dados de Teste

Para resetar e testar novamente:

```javascript
// No console do navegador (F12)
localStorage.clear();
location.reload();
```

---

## Funcionalidades Demonstradas

### ✅ Implementado
- [x] 4 tipos de usuários (roles)
- [x] Cadastro com seleção de role
- [x] Campos dinâmicos baseados no role
- [x] Validação de formulário
- [x] Sistema de permissões
- [x] Filtro de navegação por role
- [x] Página de acesso negado
- [x] Badge visual de role
- [x] Persistência em localStorage
- [x] Hooks de permissão
- [x] Componentes de proteção

### 📋 Próximas Implementações
- [ ] Página de gestão de candidatos (/candidatos)
- [ ] Página de gestão de alunos (/alunos)
- [ ] Painel administrativo (/admin)
- [ ] Sistema de auditoria
- [ ] Backend com API
- [ ] Autenticação JWT

---

## Estrutura de Arquivos

```
/src/app/
├── constants/
│   └── roles.js              # Definição de roles e permissões
├── contexts/
│   └── UserContext.jsx       # Contexto de usuário com permissões
├── components/
│   ├── RegisterPage.jsx      # Cadastro com seleção de role
│   ├── RoleBasedRoute.jsx    # Proteção de rotas
│   └── Layout.jsx            # Layout com navegação filtrada
```

---

## Troubleshooting

### Problema: Badge não aparece
**Solução:** Verifique se o usuário tem um role válido no localStorage

### Problema: Todas as páginas aparecem no menu
**Solução:** Verifique se o filtro `filteredNavigation` está sendo aplicado

### Problema: Erro ao fazer login
**Solução:** Limpe o localStorage e tente novamente

### Problema: Navegação não muda ao trocar de conta
**Solução:** Faça logout completo e login novamente

---

**Última atualização:** 21 de Janeiro de 2026
