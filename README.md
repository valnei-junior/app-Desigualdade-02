# 🎓 CarreiraHub - Plataforma de Educação e Empregabilidade

## 📋 Sobre o Projeto

Plataforma completa de educação e empregabilidade com 13 telas específicas, incluindo sistema de hierarquia de acesso, trilha de aprendizado Curso → Estágio → Emprego, busca de cursos com filtros, vagas com match de competências, alertas personalizáveis, linha do tempo visual, empresas parceiras, gamificação, mentoria e muito mais.

## ✨ Recursos Principais

- ✅ **15+ Telas Completas** - Dashboard, Cursos, Vagas, Alertas, Timeline, Empresas, Perfil, Métricas, Gamificação, Mentoria, Suporte, Configurações, Cadastro, Financeiro, Indicações
- ✅ **Sistema de Hierarquia de Acesso** - 4 tipos de usuários com permissões diferenciadas
- ✅ **Design Responsivo** - Otimizado para mobile e desktop
- ✅ **Acessibilidade** - WCAG compliant com ferramentas de acessibilidade
- ✅ **Modo Escuro/Claro** - Sistema de temas completo
- ✅ **Gamificação** - Pontos, badges e sistema de recompensas
- ✅ **Match de Competências** - Sistema inteligente de compatibilidade
- ✅ **Candidatura com Currículo** - Upload automático e envio do link para a empresa
- ✅ **Status Visual da Vaga** - Vaga aplicada fica com tonalidade diferente e botão desabilitado
- ✅ **Painel Admin** - Métricas (inscritos e cursos) + CRUD com abas e busca
- ✅ **Empresa de Cursos Online** - Painel completo, Financeiro, Indicações e Página do Curso
- ✅ **Doações por Perfil** - Página de doações com planos e permissões por tipo de usuário

## 🎯 Sistema de Hierarquia de Acesso ⭐ NOVO

### 4 Tipos de Usuários

| Tipo | Descrição | Acesso |
|------|-----------|--------|
| **🎓 Estudante** | Acesso a cursos, vagas, trilha de aprendizado | 12 páginas |
| **🏢 Empresa** | Gestão de vagas e candidatos | 6 páginas |
| **👨‍🏫 Mentor** | Mentoria e acompanhamento de alunos | 7 páginas |
| **🛡️ Admin** | Acesso total ao sistema | Todas |

### Documentação Completa

📚 **[INDEX_DOCS.md](./INDEX_DOCS.md)** - Índice completo de documentação

#### Início Rápido
- 🚀 [RESUMO_SISTEMA_ROLES.md](./RESUMO_SISTEMA_ROLES.md) - Visão geral do sistema
- 🧪 [COMO_TESTAR_ROLES.md](./COMO_TESTAR_ROLES.md) - Guia de testes práticos
- 🎨 [GUIA_VISUAL_ROLES.md](./GUIA_VISUAL_ROLES.md) - Diagramas e fluxos

#### Para Desenvolvedores
- 📖 [SISTEMA_PERMISSOES.md](./SISTEMA_PERMISSOES.md) - Documentação técnica completa
- 💻 [EXEMPLOS_CODIGO_ROLES.md](./EXEMPLOS_CODIGO_ROLES.md) - Snippets de código
- 📁 [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) - Arquitetura do projeto

## 🚀 Instalação e Execução (Local)

### Pré-requisitos
- Node.js 18+
- npm (ou pnpm)

### Instalação

```powershell
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório do projeto
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley"

# Instale as dependências do monorepo / app
npm install
# ou
pnpm install
```

### Execução (desenvolvimento)

Você pode iniciar **backend + frontend** com um único comando na raiz:

```powershell
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02"
npm run dev
```

Ou, se preferir em **terminais separados**:

Terminal 1 — backend (Express + SQLite):

```powershell
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\backend"
npm run start
# O servidor será iniciado em http://localhost:4000 por padrão
```

Terminal 2 — frontend (Vite, sem Electron):

```powershell
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\frontend"
$env:DISABLE_ELECTRON='true'
npx vite
```

Após isso, abra o navegador na URL informada pelo Vite (ex: http://localhost:5173 ou 5174).

Observações:
- Se preferir, coloque `VITE_API_URL=http://localhost:4000` em um arquivo `.env` na raiz e reinicie o dev server.
- O plugin Electron pode iniciar processos adicionais durante `vite dev`. Ao definir `DISABLE_ELECTRON=true` o plugin é desabilitado para facilitar desenvolvimento web.
- Há tarefas do VS Code em `.vscode/tasks.json` para abrir backend e frontend em terminais separados (tarefa “Run All”).

### Scripts úteis

- `npm run dev` — inicia backend + frontend (concurrently)
- `npm run start:backend` — inicia o servidor de autenticação local (porta 4000)
- `npm run start:frontend` — inicia o frontend (Vite, sem Electron)
- `npm run build` — build de produção (Vite)
- `npm run electron:dev` — inicia o modo Electron (desktop)

### Healthcheck e testes rápidos de API

Verifique se o backend está saudável:

```powershell
curl http://localhost:4000/api/health
# ou via PowerShell
(Invoke-WebRequest http://localhost:4000/api/health).Content
```

Endpoints importantes (desenvolvimento):

**Autenticação:**
- `POST /api/register` — registrar usuário (body JSON: `email`, `password`, `name`, ...). Exige aceites de Termos/Security/LGPD.
- `POST /api/login` — autenticar usuário (body JSON: `email`, `password`, `otp?`) e retorna `{ user, token }` (JWT HS256) quando válido.
- `POST /api/auth/forgot-password` — solicitar redefinição de senha (body JSON: `email`)
- `POST /api/auth/reset-password` — redefinir senha (body JSON: `token`, `password`)
  - Fluxo seguro exigido: termos obrigatórios no cadastro → verificação de e-mail → setup 2FA → login com senha + TOTP (JWT retornado no login).

**Vagas (Jobs):**
- `GET  /api/jobs` — listar todas as vagas ativas (estudantes e admin)
- `GET  /api/jobs/company/:companyId` — listar vagas de uma empresa
- `POST /api/jobs` — criar nova vaga (body JSON: `companyId`, `companyName`, `title`, `area`, `type`, ...)
- `PUT  /api/jobs/:jobId` — atualizar vaga
- `DELETE /api/jobs/:jobId` — excluir vaga

**Candidaturas (Applications):**
- `POST /api/applications` — candidatar-se a uma vaga (body JSON: `jobId`, `candidateId`, `candidateData`)
- `GET  /api/applications/company/:companyId` — listar candidaturas das vagas de uma empresa
- `PUT  /api/applications/:applicationId` — atualizar status da candidatura (body JSON: `status`)
- `DELETE /api/applications/:applicationId` — excluir candidatura

> **Fluxo de vagas:** A empresa cria vagas pelo painel (`/vagas`). As vagas aparecem automaticamente para **estudantes** e **administradores** na mesma rota `/vagas`, que busca as vagas ativas do backend via `GET /api/jobs`.
> **Candidaturas:** Ao clicar em **Candidatar-se**, o sistema faz upload do currículo (se necessário) e envia o `resumeUrl` junto com os dados do candidato. A vaga aplicada fica com tonalidade diferente e o botão fica desabilitado.
> **Rotas de empresa:** A página de candidatos é acessada em `/candidatos` (menu e dashboard).

Exemplo de curl para registro:

```powershell
curl -X POST http://localhost:4000/api/register -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"123456","name":"Teste"}'
```

Exemplo de curl para criar vaga:

```powershell
curl -X POST http://localhost:4000/api/jobs -H "Content-Type: application/json" -d '{"companyId":"123","companyName":"TechCorp","title":"Dev Frontend Jr","area":"TI","type":"Estágio","location":"São Paulo, SP","salary":"R$ 2.000"}'
```


## 🧪 Testando o Sistema

### Criar Conta de Teste

1. Acesse a página inicial
2. Clique em "Cadastrar"
3. Selecione o tipo de conta:
   - **Estudante** - Para testar funcionalidades de aprendizado
   - **Empresa** - Para testar gestão de vagas
  - **Empresa de Cursos Online** - Para testar gestão de cursos, financeiro e indicações
   - **Mentor** - Para testar mentoria
   - **Admin** - Para acesso total
4. Preencha os dados
5. Clique em "Criar Conta"
6. **Finalize cadastro seguro:**
  - Se termos não forem marcados → cadastro bloqueia.
  - Com termos marcados → receba código de e-mail, confirme.
  - Gere e confirme 2FA (TOTP).
  - Faça login com senha + TOTP para receber o JWT.

Para instruções detalhadas, veja [COMO_TESTAR_ROLES.md](./COMO_TESTAR_ROLES.md)

## 🛡️ Painel Admin

Na rota `/admin`, o administrador tem:

- **Métricas**: total de estudantes, empresas e cursos.
- **CRUD** com **abas**: Estudantes, Empresas e Cursos.
- **Busca** por nome/e-mail/área (usuários) e título/área/duração (cursos).

> Observação: neste MVP, os dados do painel Admin usam `localStorage` no navegador.

### Como acessar o Admin

1. Crie uma conta com o tipo **Admin** na tela de cadastro.
2. Faça login.
3. Abra a rota `/admin` ou clique em **Administração** no menu lateral.

#### Exemplo de credenciais (teste local)

- E-mail: `admin@local.test`
- Senha: `123456`

> Crie esta conta via cadastro antes de usar as credenciais.

## 💝 Doações e Planos

Rota: `/doacoes`

- **Administrador**: visão total (arrecadação, histórico e relatórios).
- **Estudante**: doação mensal recorrente e status de pagamento.
- **Empresa**: mensalidade fixa de R$ 50 e histórico próprio.
- **Prestador de Curso**: mensalidade fixa de R$ 50 e status próprio.
- **PIX**: geração de QR Code para pagamento na própria página.

> Apenas o administrador pode ver valores globais.

## 🎓 Empresa de Cursos Online

Na rota `/cursos`, a empresa de cursos tem um painel completo com submenu e abas de página inteira:

- **Cursos**: criação, edição e exclusão de cursos.
- **Página do Curso**: detalhes do curso com turmas e alunos, matrícula única e status (aprovado/reprovado).
- **Professores e Turmas**: cadastro e vínculo com cursos.
- **Alunos**: acompanhamento de matrículas e progresso.
- **Financeiro**: salários, pagamentos e alunos em dia/atrasados (`/financeiro`).
- **Indicações**: envio direto de alunos para empresas parceiras (`/indicacoes`).

> Observação: neste MVP, os dados usam `localStorage` no navegador.

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **JavaScript (ES6+)** - Linguagem principal
- **Tailwind CSS v4** - Estilização
- **React Router** - Navegação
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **Sonner** - Notificações

### Componentes UI
- **shadcn/ui** - Biblioteca de componentes
- **Radix UI** - Primitivos acessíveis
- **Class Variance Authority** - Variantes de estilo

### Funcionalidades
- **Context API** - Gerenciamento de estado
- **LocalStorage** - Persistência de dados
- **Custom Hooks** - Lógica reutilizável

## 📁 Estrutura do Projeto

```
/
├── src/
│   ├── app/
│   │   ├── components/       # Componentes React
│   │   │   ├── ui/          # Componentes UI (shadcn)
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── RoleBasedRoute.jsx
│   │   │   └── ...outras páginas
│   │   ├── contexts/        # Context API
│   │   │   ├── UserContext.jsx
│   │   │   └── SettingsContext.jsx
│   │   ├── constants/       # Constantes e configurações
│   │   │   └── roles.js     # Roles e permissões
│   │   ├── hooks/           # Custom hooks
│   │   └── data/            # Mock data
│   └── styles/              # Estilos globais
├── public/                  # Arquivos estáticos
└── docs/                    # Documentação (*.md)
```

## 🎨 Funcionalidades de Acessibilidade

- ✅ **Modo Escuro/Claro/Automático**
- ✅ **4 Tamanhos de Fonte** (Pequena, Média, Grande, Extra Grande)
- ✅ **5 Temas de Cores** (Azul, Verde, Roxo, Laranja, Rosa)
- ✅ **Alto Contraste**
- ✅ **Redução de Movimento**
- ✅ **Economia de Dados**
- ✅ **Atalhos de Teclado**
- ✅ **Skip to Content**
- ✅ **ARIA Labels**

## 🔐 Sistema de Permissões

### Permissões Principais

- **Navegação**: VIEW_DASHBOARD, VIEW_COURSES, VIEW_JOBS, etc.
- **Cursos**: ENROLL_COURSES, CREATE_COURSES, EDIT_COURSES
- **Vagas**: APPLY_JOBS, CREATE_JOBS, MANAGE_CANDIDATES
- **Mentoria**: REQUEST_MENTORSHIP, PROVIDE_MENTORSHIP
- **Admin**: MANAGE_USERS, MANAGE_SYSTEM, VIEW_ALL_DATA

### Exemplo de Uso

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

Veja mais exemplos em [EXEMPLOS_CODIGO_ROLES.md](./EXEMPLOS_CODIGO_ROLES.md)

## 📱 Responsividade

- ✅ **Mobile First** - Design otimizado para dispositivos móveis
- ✅ **Breakpoints Adaptativos** - sm, md, lg, xl
- ✅ **Bottom Navigation** - Navegação otimizada para mobile
- ✅ **Touch Friendly** - Áreas de toque adequadas
- ✅ **Menu Lateral** - Sidebar colapsável em mobile

## 🎮 Gamificação

- 🏆 **Sistema de Pontos** - Ganhe pontos por ações
- 🎖️ **Badges** - Conquiste medalhas
- 📊 **Ranking** - Compare-se com outros usuários
- 🎯 **Desafios** - Complete missões especiais
- ⭐ **Níveis** - Evolua na plataforma

## 📈 Métricas e Análises

- **Indicador de Chance de Contratação** - Análise personalizada
- **Progresso da Trilha** - Visualização do caminho
- **Match de Competências** - Compatibilidade em %
- **Gráficos Interativos** - Dados visuais

## 🤝 Mentoria

- 👨‍🏫 **Mentores Profissionais** - Conecte-se com especialistas
- 📅 **Agendamento** - Marque sessões
- 💬 **Feedback** - Receba orientações
- 📊 **Acompanhamento** - Monitore progresso

## 🏢 Empresas Parceiras

- ⭐ **Indicador de Confiabilidade** - Avaliação transparente
- 📋 **Perfis Completos** - Informações detalhadas
- 🔔 **Alertas de Vagas** - Notificações personalizadas

## ⚠️ Importante

Este é um sistema de **demonstração frontend**. Para uso em produção:

- ✅ Implemente backend com API segura
- ✅ Use autenticação JWT
- ✅ Valide permissões no servidor
- ✅ Não armazene dados sensíveis no localStorage
- ✅ Use HTTPS
- ✅ Implemente rate limiting

## 🗄️ Modelo de Banco de Dados (exemplo)

Veja o arquivo de referência em [backend/schema.sql](backend/schema.sql).

## 📝 Roadmap

### ✅ Implementado
- [x] Sistema completo de hierarquia
- [x] 4 tipos de usuários
- [x] 34 permissões definidas
- [x] Navegação adaptativa
- [x] Cadastro inteligente
- [x] Documentação completa
- [x] Página de gestão de candidatos
- [x] Página de gestão de alunos
- [x] Painel administrativo completo
- [x] Painel de empresa de cursos (financeiro, indicações e página do curso)
- [x] API de vagas — empresa cria, estudante e admin visualizam automaticamente
- [x] API de candidaturas — estudante se candidata, empresa gerencia
- [x] Redefinição de senha (forgot/reset password com e-mail)

### 🚧 Em Desenvolvimento
- [ ] Backend com API completo (produção)

### 📋 Planejado
- [ ] Autenticação JWT
- [ ] OAuth (Google, LinkedIn)
- [ ] Sistema de notificações
- [ ] Chat em tempo real

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas sobre o sistema:

1. **Documentação**: Consulte [INDEX_DOCS.md](./INDEX_DOCS.md)
2. **Código**: Veja [EXEMPLOS_CODIGO_ROLES.md](./EXEMPLOS_CODIGO_ROLES.md)
3. **Testes**: Siga [COMO_TESTAR_ROLES.md](./COMO_TESTAR_ROLES.md)

## 🙏 Agradecimentos

- shadcn/ui - Componentes UI
- Lucide - Ícones
- Tailwind CSS - Estilização
- React Router - Navegação
- Recharts - Gráficos

---

**Versão**: 1.1.0  
**Última Atualização**: 05 de Fevereiro de 2026

⭐ Se este projeto foi útil, considere dar uma estrela!



cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\backend"
npm run start

cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\frontend"
$env:DISABLE_ELECTRON='true'
npx vite

O frontend inicia em http://localhost:5173 (ou 5174)

Depois abra o navegador em http://localhost:5173.