# 🎓 CarreiraHub - Plataforma de Educação e Empregabilidade

## 📋 Sobre o Projeto

Plataforma completa de educação e empregabilidade com 13 telas específicas, incluindo sistema de hierarquia de acesso, trilha de aprendizado Curso → Estágio → Emprego, busca de cursos com filtros, vagas com match de competências, alertas personalizáveis, linha do tempo visual, empresas parceiras, gamificação, mentoria e muito mais.

## ✨ Recursos Principais

- ✅ **13 Telas Completas** - Dashboard, Cursos, Vagas, Alertas, Timeline, Empresas, Perfil, Métricas, Gamificação, Mentoria, Suporte, Configurações, Cadastro
- ✅ **Sistema de Hierarquia de Acesso** - 4 tipos de usuários com permissões diferenciadas
- ✅ **Design Responsivo** - Otimizado para mobile e desktop
- ✅ **Acessibilidade** - WCAG compliant com ferramentas de acessibilidade
- ✅ **Modo Escuro/Claro** - Sistema de temas completo
- ✅ **Gamificação** - Pontos, badges e sistema de recompensas
- ✅ **Match de Competências** - Sistema inteligente de compatibilidade

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

Este repositório contém um pequeno servidor de autenticação usado em desenvolvimento (`server/index.cjs`) e a aplicação frontend (Vite). Recomendo abrir dois terminais.

Terminal 1 — iniciar servidor de autenticação (Express + SQLite):

```powershell
# Entre na pasta do backend e instale dependências (uma só vez):
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\server"
npm install

# Inicie o servidor em modo desenvolvimento (usa nodemon):
npm run dev

# O servidor será iniciado em http://localhost:4000 por padrão
```

Terminal 2 — iniciar frontend (Vite):

```powershell
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley"
# Informe a URL da API e desabilite o plugin Electron durante o desenvolvimento local (opcional)
$env:VITE_API_URL='http://localhost:4000'
$env:DISABLE_ELECTRON='true'
npm run dev
```

Após isso, abra o navegador em `http://localhost:5173`.

Observações:
- Se preferir, coloque `VITE_API_URL=http://localhost:4000` em um arquivo `.env` na raiz e reinicie o dev server.
- O plugin Electron pode iniciar processos adicionais durante `vite dev`. Ao definir `DISABLE_ELECTRON=true` (ou exportar essa variável) o plugin é desabilitado para facilitar desenvolvimento web.

### Scripts úteis

- Backend (dentro de `server/`):
  - `npm run dev` — inicia o servidor de desenvolvimento (nodemon)
  - `npm start` — inicia o servidor sem nodemon
- Frontend (na raiz do projeto):
  - `npm run dev` — inicia o Vite (frontend)
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
- `POST /api/register` — registrar usuário (body JSON: `email`, `password`, `name`, ...)
- `POST /api/login` — autenticar usuário (body JSON: `email`, `password`)
- `POST /api/guest` — cria/retorna um usuário 'guest' (usado por botões de login rápido na UI)

Observação: havia dois arquivos de servidor em `server/` (`index.cjs` e `index.js`). Para evitar confusão mantivemos apenas `index.cjs` (fonte de verdade) e removemos `index.js`. Use os comandos acima dentro de `server/`.

Exemplo de curl para registro:

```powershell
curl -X POST http://localhost:4000/api/register -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"123456","name":"Teste"}'
```


## 🧪 Testando o Sistema

### Criar Conta de Teste

1. Acesse a página inicial
2. Clique em "Cadastrar"
3. Selecione o tipo de conta:
   - **Estudante** - Para testar funcionalidades de aprendizado
   - **Empresa** - Para testar gestão de vagas
   - **Mentor** - Para testar mentoria
   - **Admin** - Para acesso total
4. Preencha os dados
5. Clique em "Criar Conta"

Para instruções detalhadas, veja [COMO_TESTAR_ROLES.md](./COMO_TESTAR_ROLES.md)

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

## 📝 Roadmap

### ✅ Implementado
- [x] Sistema completo de hierarquia
- [x] 4 tipos de usuários
- [x] 34 permissões definidas
- [x] Navegação adaptativa
- [x] Cadastro inteligente
- [x] Documentação completa

### 🚧 Em Desenvolvimento
- [ ] Página de gestão de candidatos
- [ ] Página de gestão de alunos
- [ ] Painel administrativo completo

### 📋 Planejado
- [ ] Backend com API
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

**Versão**: 1.0.0  
**Última Atualização**: 21 de Janeiro de 2026

⭐ Se este projeto foi útil, considere dar uma estrela!
