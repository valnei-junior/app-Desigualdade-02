# 🚀 CarreiraHub - Plataforma de Educação e Empregabilidade

Uma aplicação desktop completa desenvolvida com React, Electron e Tailwind CSS, focada em educação profissional e empregabilidade com recursos avançados de acessibilidade.

## ✨ Características Principais

### 📱 13 Telas Funcionais

1. **Login/Boas-vindas** - Interface de autenticação moderna
2. **Cadastro** - Registro de novos usuários
3. **Dashboard** - Visão geral com trilha Curso → Estágio → Emprego
4. **Busca de Cursos** - Filtros avançados e inscrição em 1 clique
5. **Vagas** - Sistema de match de competências com porcentagem
6. **Alertas** - Notificações personalizáveis
7. **Linha do Tempo** - Visualização cronológica do progresso
8. **Empresas Parceiras** - Indicador de confiabilidade
9. **Perfil** - Com feedback de empresas
10. **Métricas** - Indicador de chance de contratação
11. **Suporte** - FAQ integrado
12. **Gamificação** - Sistema de pontos e badges
13. **Mentoria** - Conexão com profissionais
14. **Configurações** - ⭐ Nova página completa de acessibilidade

### ♿ Acessibilidade Avançada

#### 🎨 Aparência Personalizável

- **Modo Escuro/Claro** com detecção automática do sistema
- **5 Temas de Cores**: Padrão, Azul, Verde, Roxo, Laranja
- **Alto Contraste** para melhor visibilidade
- **4 Tamanhos de Fonte**: Pequeno, Médio, Grande, Extra Grande
- **3 Opções de Espaçamento**: Compacto, Normal, Confortável

#### 🔊 Tecnologias Assistivas

- **Otimizado para Leitores de Tela** (NVDA, JAWS, VoiceOver)
- **Atalhos de Teclado** completos
- **Redução de Animações** para sensibilidade a movimento
- **Labels ARIA** e estrutura semântica

#### ⚡ Outros Recursos

- **Economia de Dados** - Reduz uso de banda
- **Notificações Configuráveis** - Som, Push e Email
- **Exportar/Importar Configurações** - Backup fácil
- **Toolbar Flutuante** - Acesso rápido às configurações

## 🛠️ Tecnologias Utilizadas

- **React 18** - Interface de usuário
- **Electron** - Aplicação desktop
- **Vite** - Build tool rápida
- **Tailwind CSS v4** - Estilização moderna
- **shadcn/ui** - Componentes UI de alta qualidade
- **Lucide React** - Ícones elegantes
- **React Router** - Navegação
- **Recharts** - Gráficos e visualizações

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos

```powershell
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório do app (monorepo)
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02"

# Instale as dependências
npm install

# Executar backend + frontend juntos (concurrently)
npm run dev

# Ou execute separadamente em dois terminais
# Terminal 1 — backend (Express + SQLite)
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\backend"
npm run start

# Terminal 2 — frontend (Vite, sem Electron)
cd "C:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\frontend"
$env:DISABLE_ELECTRON='true'
npx vite
```

## 🎯 Como Usar

### Primeira Execução

1. Execute `npm run electron:dev`
2. Faça login com qualquer credencial (dados mock)
3. Explore as 13 telas disponíveis
4. Acesse "Configurações" para personalizar sua experiência

### Acessando Configurações

#### Opção 1: Menu Lateral (Desktop)

- Clique em "Configurações" na barra lateral esquerda

#### Opção 2: Menu Mobile

- Abra o menu hambúrguer (☰)
- Selecione "Configurações"

#### Opção 3: Toolbar Flutuante

- Clique no botão de acessibilidade (👁️) no canto inferior direito
- Clique em "Mais Configurações"

### Atalhos de Teclado

| Atalho     | Ação                       |
| ---------- | -------------------------- |
| `Ctrl + +` | Aumentar fonte             |
| `Ctrl + -` | Diminuir fonte             |
| `Ctrl + D` | Alternar modo escuro       |
| `Alt + N`  | Ir para navegação          |
| `Alt + C`  | Ir para conteúdo principal |
| `ESC`      | Fechar modais              |

## 📁 Estrutura do Projeto

```
carreira-hub/
├── electron.cjs              # Configuração Electron
├── preload.cjs              # Preload script Electron
├── src/
│   ├── app/
│   │   ├── components/      # Componentes React
│   │   │   ├── SettingsPage.jsx        # ⭐ Página de configurações
│   │   │   ├── AccessibilityToolbar.jsx # Toolbar flutuante
│   │   │   ├── Layout.jsx               # Layout principal
│   │   │   └── ui/                      # Componentes UI (shadcn)
│   │   ├── contexts/        # Context API
│   │   │   ├── SettingsContext.jsx  # ⭐ Gerenciamento de configurações
│   │   │   └── UserContext.tsx
│   │   ├── hooks/           # Custom Hooks
│   │   │   └── useKeyboardShortcuts.js
│   │   └── data/            # Dados mock
│   ├── styles/
│   │   ├── theme.css        # ⭐ Temas e acessibilidade
│   │   └── tailwind.css
│   └── main.jsx             # Entry point
├── GUIA_CONFIGURACOES.md    # ⭐ Guia completo de configurações
├── CONVERSION_GUIDE.md      # Guia de conversão TS → JS
└── package.json
```

## 🎨 Personalização

### Alterando Temas de Cor

1. Acesse "Configurações" → "Tema de Cores"
2. Escolha entre 5 opções disponíveis
3. As mudanças são aplicadas instantaneamente

### Ajustando Acessibilidade

1. Acesse "Configurações"
2. Navegue pelas seções:
   - Aparência
   - Tema de Cores
   - Tamanho do Texto
   - Espaçamento de Linha
   - Animações e Movimento
   - Tecnologias Assistivas
   - Notificações
   - Economia de Dados
   - Idioma

### Backup de Configurações

```javascript
// Exportar configurações
// 1. Vá em "Configurações"
// 2. Seção "Backup de Configurações"
// 3. Clique em "Exportar Configurações"
// 4. Arquivo JSON será baixado

// Importar configurações
// 1. Vá em "Configurações"
// 2. Seção "Backup de Configurações"
// 3. Clique em "Importar Configurações"
// 4. Selecione o arquivo JSON
```

## 🧪 Testes de Acessibilidade

### Ferramentas Recomendadas

- **axe DevTools** - Chrome/Firefox extension
- **WAVE** - Web accessibility evaluation
- **Lighthouse** - Integrado no Chrome DevTools
- **NVDA** - Leitor de tela gratuito (Windows)
- **VoiceOver** - Leitor de tela nativo (macOS)

### Checklist de Acessibilidade

- ✅ Contraste adequado (WCAG AA)
- ✅ Navegação por teclado
- ✅ Labels ARIA apropriados
- ✅ Estrutura semântica (h1-h6)
- ✅ Alternativas para imagens
- ✅ Foco visível
- ✅ Redução de movimento
- ✅ Suporte a leitores de tela

## 🐛 Solução de Problemas

### Configurações não estão sendo salvas

- Verifique se o localStorage está habilitado
- Limpe o cache do navegador/Electron
- Tente exportar e reimportar as configurações

### Atalhos de teclado não funcionam

- Verifique se não há conflito com atalhos do sistema
- Certifique-se de que o foco está na aplicação
- Tente recarregar a aplicação

### Modo escuro não funciona

- Desative o "Tema Automático" se estiver ativado
- Verifique as permissões do navegador/Electron
- Force o refresh (Ctrl+R)

## 📚 Documentação Adicional

- [GUIA_CONFIGURACOES.md](./GUIA_CONFIGURACOES.md) - Guia completo de configurações
- [CONVERSION_GUIDE.md](./CONVERSION_GUIDE.md) - Guia de conversão TypeScript → JavaScript
- [SETTINGS_GUIDE.md](./SETTINGS_GUIDE.md) - Guia de configurações do Electron

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 👥 Autores

- **Desenvolvedor Principal** - Desenvolvimento inicial e conversão TS→JS
- **Contribuidores** - Agradecimentos a todos que contribuíram

## 🎉 Agradecimentos

- shadcn/ui pela biblioteca de componentes excelente
- Tailwind CSS pela ferramenta de estilização incrível
- Lucide pela biblioteca de ícones
- Comunidade React e Electron

## 📞 Suporte

Para suporte, acesse a página "Suporte" dentro da aplicação ou consulte o FAQ integrado.

## 🗺️ Roadmap

### Versão Atual (v1.0)

- ✅ 13 telas funcionais
- ✅ Sistema completo de acessibilidade
- ✅ Aplicação Electron desktop
- ✅ Dados mock integrados

### Próximas Versões

- 🔄 Integração com backend real
- 🔄 Tradução completa (multi-idioma)
- 🔄 Sincronização de configurações em nuvem
- 🔄 Modo offline completo
- 🔄 Notificações push nativas
- 🔄 Mais opções de personalização
- 🔄 Sistema de feedback de usuários
- 🔄 Analytics e métricas de uso

## ⚡ Performance

- Bundle otimizado com Vite
- Lazy loading de componentes
- Memoização de componentes React
- CSS otimizado com Tailwind
- Imagens otimizadas

## 🔒 Segurança

- Dados armazenados localmente (localStorage)
- Nenhuma transmissão de dados para servidores externos
- Configurações criptografadas (futuro)
- Autenticação segura (futuro)

## 🌐 Compatibilidade

### Navegadores (modo web)

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Sistemas Operacionais (Electron)

- Windows 10/11
- macOS 10.14+
- Linux (Ubuntu 20.04+)

### Resolução de Tela

- Desktop: 1366x768+
- Mobile: 375x667+
- Tablet: 768x1024+

---

**Desenvolvido com ❤️ para melhorar a educação e empregabilidade**