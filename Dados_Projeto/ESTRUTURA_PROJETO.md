# 📁 Estrutura do Projeto - Frontend/Backend

## 🎯 Visão Geral

Esta é uma aplicação **100% Frontend** que roda como:
- **Web App** (navegador)
- **Desktop App** (Electron)

**⚠️ Não há backend real nesta aplicação** - todos os dados são mock/simulados.

---

## 📂 Estrutura de Pastas

### 🎨 FRONTEND (Interface do Usuário)

#### `/src/app/components/`
**Tipo:** Frontend - Componentes React  
**Descrição:** Todos os componentes de interface da aplicação

```
/src/app/components/
├── ui/                          # Componentes UI reutilizáveis (shadcn/ui)
│   ├── button.tsx              # Botões
│   ├── card.tsx                # Cards
│   ├── dialog.tsx              # Modais
│   ├── input.tsx               # Inputs
│   ├── switch.tsx              # Toggle switches
│   └── ... (40+ componentes)
│
├── AccessibilityToolbar.jsx    # Toolbar de acessibilidade flutuante
├── SkipToContent.jsx           # Link "Pular para conteúdo"
├── Layout.jsx                  # Layout principal com navegação
├── Layout.tsx                  # Layout (versão TypeScript)
│
├── WelcomePage.tsx             # Página de login/boas-vindas
├── RegisterPage.tsx            # Página de cadastro
├── Dashboard.tsx               # Dashboard principal
├── CoursesPage.tsx             # Página de cursos
├── JobsPage.tsx                # Página de vagas
├── AlertsPage.tsx              # Página de alertas
├── TimelinePage.tsx            # Linha do tempo
├── CompaniesPage.tsx           # Empresas parceiras
├── ProfilePage.tsx             # Perfil do usuário
├── MetricsPage.tsx             # Métricas e estatísticas
├── GamificationPage.tsx        # Sistema de gamificação
├── MentorshipPage.tsx          # Sistema de mentoria
├── SupportPage.tsx             # Página de suporte/FAQ
└── SettingsPage.jsx            # ⭐ Página de configurações
```

---

#### `/src/app/contexts/`
**Tipo:** Frontend - Gerenciamento de Estado  
**Descrição:** Contextos React (Context API) para estado global

```
/src/app/contexts/
├── UserContext.tsx             # Autenticação e dados do usuário
└── SettingsContext.jsx         # ⭐ Configurações de acessibilidade
```

**Funções:**
- `UserContext` - Gerencia login, logout, dados do usuário
- `SettingsContext` - Gerencia 13 configurações de acessibilidade

---

#### `/src/app/data/`
**Tipo:** Frontend - Dados Mock (Simulação de Backend)  
**Descrição:** Dados simulados para desenvolvimento

```
/src/app/data/
└── mockData.ts                 # Dados mock de cursos, vagas, empresas, etc.
```

**⚠️ Em produção, estes dados viriam de uma API real (backend)**

---

#### `/src/app/hooks/`
**Tipo:** Frontend - Lógica Reutilizável  
**Descrição:** Custom Hooks React

```
/src/app/hooks/
└── useKeyboardShortcuts.js     # ⭐ Atalhos de teclado (Ctrl+D, Ctrl++, etc.)
```

---

#### `/src/styles/`
**Tipo:** Frontend - Estilos CSS  
**Descrição:** Folhas de estilo globais

```
/src/styles/
├── index.css                   # Importações principais
├── tailwind.css                # Configuração Tailwind
├── theme.css                   # ⭐ Temas e variáveis de acessibilidade
└── fonts.css                   # Importações de fontes
```

---

### 🖥️ ELECTRON (Desktop App)

#### Arquivos Electron na Raiz

```
/
├── electron.cjs                # ⚡ Processo principal do Electron
├── preload.cjs                 # ⚡ Script de preload (ponte segura)
└── vite.config.js              # ⚡ Configuração Vite + Electron
```

**Descrição:**
- `electron.cjs` - Cria a janela do app desktop
- `preload.cjs` - Expõe APIs do Node.js de forma segura
- `vite.config.js` - Configura build para Electron

---

### ⚙️ CONFIGURAÇÃO E BUILD

#### Arquivos de Configuração

```
/
├── package.json                # Dependências e scripts npm
├── vite.config.ts              # Configuração Vite (web)
├── vite.config.js              # Configuração Vite (electron)
├── postcss.config.mjs          # Configuração PostCSS
├── index.html                  # HTML principal
└── tsconfig.json               # (se existir) Configuração TypeScript
```

---

### 📚 DOCUMENTAÇÃO

```
/
├── README_PT.md                # 📖 README em português
├── GUIA_CONFIGURACOES.md       # 📖 Guia completo de configurações
├── EXEMPLOS_USO.md             # 📖 Exemplos de código
├── SUMARIO_EXECUTIVO.md        # 📖 Resumo executivo
├── CHECKLIST_TESTES.md         # 📖 Checklist de testes
├── ESTRUTURA_PROJETO.md        # 📖 Este arquivo
├── CONVERSION_GUIDE.md         # 📖 Guia de conversão TS→JS
├── SETTINGS_GUIDE.md           # 📖 Guia de settings (inglês)
└── ATTRIBUTIONS.md             # 📖 Atribuições
```

---

## 🔄 Fluxo de Dados (Frontend Only)

```
┌─────────────────────────────────────────────┐
│          INTERFACE DO USUÁRIO               │
│  (Componentes React em /src/app/components) │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│         GERENCIAMENTO DE ESTADO             │
│    (Contexts em /src/app/contexts)          │
│  • UserContext (autenticação)               │
│  • SettingsContext (configurações)          │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│            DADOS LOCAIS                     │
│  • localStorage (persistência)              │
│  • mockData.ts (dados simulados)            │
│  • ⚠️ EM PRODUÇÃO: API Backend              │
└─────────────────────────────────────────────┘
```

---

## 🌐 Como Adicionar Backend (Futuro)

### Opção 1: API REST

```
/src/app/services/         # ⚠️ CRIAR ESTA PASTA
├── api.js                 # Cliente HTTP (axios/fetch)
├── authService.js         # Autenticação
├── coursesService.js      # Cursos
├── jobsService.js         # Vagas
└── settingsService.js     # Configurações (sincronizar)
```

**Exemplo:**
```javascript
// /src/app/services/api.js
const API_URL = 'https://api.carreirahub.com';

export const fetchCourses = async () => {
  const response = await fetch(`${API_URL}/courses`);
  return response.json();
};
```

### Opção 2: Firebase/Supabase

```
/src/app/config/
└── firebase.js            # Configuração Firebase

/src/app/services/
├── firebaseAuth.js        # Autenticação Firebase
└── firestore.js           # Banco de dados Firestore
```

### Opção 3: GraphQL

```
/src/app/graphql/
├── client.js              # Cliente Apollo
├── queries.js             # Queries GraphQL
└── mutations.js           # Mutations GraphQL
```

---

## 📊 Estrutura Atual vs. Futura

### ✅ Estrutura Atual (Frontend Only)

```
Frontend (React)
    ↓
Contexts (Estado Global)
    ↓
localStorage (Persistência)
    ↓
mockData.ts (Dados Simulados)
```

### 🔮 Estrutura Futura (Com Backend)

```
Frontend (React)
    ↓
Contexts (Estado Global)
    ↓
Services (API Calls)
    ↓
Backend API (Node.js/Python/etc)
    ↓
Banco de Dados (PostgreSQL/MongoDB/etc)
```

---

## 🎯 Resumo por Categoria

### 🎨 Frontend (Interface)
- `/src/app/components/` - Componentes React (14 páginas + 40+ componentes UI)
- `/src/styles/` - CSS e Tailwind
- `/index.html` - HTML principal

### 🧠 Frontend (Lógica)
- `/src/app/contexts/` - Estado global (UserContext, SettingsContext)
- `/src/app/hooks/` - Hooks customizados
- `/src/app/data/` - Dados mock (substituir por API futura)

### 🖥️ Desktop App
- `electron.cjs` - App Electron
- `preload.cjs` - Ponte de segurança
- `vite.config.js` - Build config

### ⚙️ Configuração
- `package.json` - Dependências
- `vite.config.ts` - Build web
- `postcss.config.mjs` - PostCSS

### 📚 Documentação
- 9 arquivos markdown com guias e exemplos

---

## 🚀 Scripts Disponíveis

```bash
# Frontend (Web)
npm run dev              # Roda em modo desenvolvimento (navegador)
npm run build           # Build para produção

# Desktop (Electron)
npm run electron:dev    # Roda como app desktop
npm run electron:build  # Build app desktop (.exe, .dmg, .AppImage)
```

---

## 💡 Dicas para Organização

### Se Adicionar Backend:

1. **Criar pasta `/src/app/services/`**
   ```
   /src/app/services/
   ├── api.js              # Cliente HTTP base
   ├── auth.js             # Autenticação
   ├── courses.js          # CRUD de cursos
   ├── jobs.js             # CRUD de vagas
   └── settings.js         # Sincronização de configurações
   ```

2. **Substituir mockData por chamadas reais**
   ```javascript
   // Antes (mock)
   import { mockCourses } from '@/app/data/mockData';
   const courses = mockCourses;
   
   // Depois (API real)
   import { fetchCourses } from '@/app/services/courses';
   const courses = await fetchCourses();
   ```

3. **Criar pasta `/backend/` separada (se full-stack)**
   ```
   /backend/
   ├── src/
   │   ├── routes/         # Rotas da API
   │   ├── controllers/    # Lógica de negócio
   │   ├── models/         # Modelos de dados
   │   └── config/         # Configurações
   ├── package.json
   └── server.js
   ```

---

## 📝 Checklist de Migração Frontend → Full-Stack

- [ ] Criar pasta `/src/app/services/`
- [ ] Implementar cliente HTTP (axios/fetch)
- [ ] Criar serviços para cada entidade (cursos, vagas, etc)
- [ ] Substituir mockData por chamadas API
- [ ] Adicionar tratamento de erros
- [ ] Implementar loading states
- [ ] Configurar autenticação JWT/OAuth
- [ ] Adicionar cache/otimização
- [ ] Implementar offline-first (opcional)
- [ ] Setup CI/CD para deploy

---

## 🎓 Conclusão

**Estrutura Atual:**
- ✅ 100% Frontend (React + Electron)
- ✅ Dados mock (desenvolvimento)
- ✅ localStorage (persistência local)
- ✅ 13 configurações de acessibilidade
- ✅ Pronto para desktop e web

**Próximo Passo:**
- 🔄 Adicionar backend (API REST/GraphQL/Firebase)
- 🔄 Substituir dados mock por dados reais
- 🔄 Implementar autenticação real
- 🔄 Sincronização em nuvem

---

**Última Atualização:** Janeiro 2026  
**Versão:** 1.0.0
