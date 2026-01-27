# 🎨 Guia de Configurações e Acessibilidade

## Visão Geral

A aplicação CarreiraHub agora possui uma página completa de Configurações com recursos avançados de acessibilidade e personalização. Esta documentação descreve todas as funcionalidades disponíveis.

## 📍 Acessando as Configurações

Existem 3 formas de acessar as configurações:

1. **Menu lateral (Desktop)**: Clique no item "Configurações" na barra lateral esquerda
2. **Menu hambúrguer (Mobile)**: Abra o menu e selecione "Configurações"
3. **Toolbar de Acessibilidade**: Clique no botão flutuante de olho (👁️) no canto inferior direito e depois em "Mais Configurações"

## ⚙️ Configurações Disponíveis

### 1. Aparência

#### Tema Automático
- **O que faz**: Detecta automaticamente as preferências de tema do seu sistema operacional
- **Como usar**: Ative o switch "Tema Automático"
- **Nota**: Quando ativado, o controle de "Modo Escuro" fica desabilitado

#### Modo Escuro
- **O que faz**: Alterna entre tema claro e escuro
- **Como usar**: Ative/desative o switch ou use o atalho `Ctrl + D`
- **Benefício**: Reduz o brilho da tela em ambientes com pouca luz

#### Alto Contraste
- **O que faz**: Aumenta o contraste entre textos e fundos
- **Como usar**: Ative o switch "Alto Contraste"
- **Benefício**: Melhora a legibilidade para pessoas com baixa visão

### 2. Tema de Cores

Escolha entre 5 esquemas de cores:
- **Padrão**: Azul escuro tradicional
- **Azul**: Tons de azul vibrante
- **Verde**: Tons de verde naturais
- **Roxo**: Tons de roxo modernos
- **Laranja**: Tons de laranja energéticos

**Como usar**: Clique no tema desejado para aplicar instantaneamente

### 3. Tamanho do Texto

#### Opções de Tamanho
- **Pequeno**: 14px
- **Médio**: 16px (padrão)
- **Grande**: 18px
- **Extra Grande**: 20px

#### Como ajustar
- Use os botões + e - na página de configurações
- Atalhos de teclado:
  - `Ctrl + +` para aumentar
  - `Ctrl + -` para diminuir

**Nota**: Todas as páginas da aplicação respeitam o tamanho de fonte escolhido.

### 4. Espaçamento de Linha

Ajuste o espaçamento entre linhas para melhor leitura:
- **Compacto**: 1.4 (menos espaço)
- **Normal**: 1.6 (padrão)
- **Confortável**: 1.8 (mais espaço)

**Benefício**: Facilita a leitura para pessoas com dislexia ou dificuldades de leitura.

### 5. Animações e Movimento

#### Reduzir Animações
- **O que faz**: Minimiza todas as animações e transições
- **Como usar**: Ative o switch "Reduzir Animações"
- **Benefício**: Importante para pessoas com sensibilidade a movimento ou epilepsia fotossensível

### 6. Tecnologias Assistivas

#### Modo Leitor de Tela
- **O que faz**: Otimiza a navegação para leitores de tela como NVDA, JAWS, VoiceOver
- **Como usar**: Ative o switch "Modo Leitor de Tela"
- **Recursos**:
  - Labels ARIA aprimorados
  - Estrutura semântica otimizada
  - Navegação por landmarks

### 7. Notificações

#### Três tipos de notificações configuráveis:

1. **Notificações Sonoras**
   - Reproduz sons ao receber alertas
   - Útil para feedback auditivo

2. **Notificações Push**
   - Alertas no desktop sobre:
     - Novas vagas compatíveis
     - Cursos disponíveis
     - Lembretes de prazos

3. **Notificações por Email**
   - Resumos diários/semanais
   - Atualizações importantes

### 8. Economia de Dados

#### Modo Economia de Dados
- **O que faz**:
  - Reduz qualidade de imagens (aplica filtro grayscale 50%)
  - Remove imagens de fundo
  - Desativa carregamento automático
- **Quando usar**: Conexões lentas ou com limite de dados

### 9. Idioma

#### Idiomas disponíveis:
- 🇧🇷 Português (Brasil)
- 🇺🇸 English (US)
- 🇪🇸 Español
- 🇫🇷 Français

**Nota**: Atualmente a interface está em português. O suporte a outros idiomas está planejado.

### 10. Atalhos de Teclado

#### Atalhos disponíveis:
- `Ctrl + +`: Aumentar fonte
- `Ctrl + -`: Diminuir fonte
- `Ctrl + D`: Alternar modo escuro
- `Alt + N`: Ir para navegação
- `Alt + C`: Ir para conteúdo principal
- `ESC`: Fechar modais

### 11. Backup de Configurações

#### Exportar Configurações
- Salva todas as suas preferências em um arquivo JSON
- Útil para backup ou transferência entre dispositivos

#### Importar Configurações
- Restaura configurações de um arquivo JSON exportado anteriormente
- Mantém suas preferências em múltiplos dispositivos

### 12. Restaurar Padrões

- **O que faz**: Reverte todas as configurações para os valores padrão
- **Como usar**: Clique no botão "Restaurar Configurações Padrão"
- **Aviso**: Esta ação não pode ser desfeita (a menos que você tenha um backup)

## 🛠️ Toolbar de Acessibilidade (Acesso Rápido)

O botão flutuante com ícone de olho (👁️) fornece acesso rápido a:
- Controles de tamanho de fonte
- Toggle de modo escuro
- Toggle de alto contraste
- Link para configurações completas

**Localização**: Canto inferior direito da tela

## 💾 Persistência de Dados

- Todas as configurações são salvas automaticamente no `localStorage`
- As preferências permanecem mesmo após fechar o aplicativo
- Não é necessário clicar em "Salvar"

## 🎯 Casos de Uso Comuns

### Para Usuários com Baixa Visão
1. Ative "Alto Contraste"
2. Aumente o tamanho da fonte para "Grande" ou "Extra Grande"
3. Use o espaçamento de linha "Confortável"

### Para Usuários com Sensibilidade à Luz
1. Ative "Modo Escuro" ou "Tema Automático"
2. Considere usar um tema de cor mais suave

### Para Usuários com Dislexia
1. Aumente o tamanho da fonte
2. Use espaçamento de linha "Confortável"
3. Ative "Alto Contraste" se necessário

### Para Usuários com Sensibilidade a Movimento
1. Ative "Reduzir Animações"
2. Desative notificações visuais se necessário

### Para Usuários de Leitores de Tela
1. Ative "Modo Leitor de Tela"
2. Use os atalhos de teclado para navegação rápida
3. Ative "Notificações Sonoras" para feedback

### Para Conexões Lentas
1. Ative "Modo Economia de Dados"
2. Desative "Notificações Push"

## 🔧 Implementação Técnica

### Estrutura de Arquivos

```
/src/app/
├── contexts/
│   └── SettingsContext.jsx      # Gerenciamento de estado das configurações
├── components/
│   ├── SettingsPage.jsx         # Página completa de configurações
│   ├── AccessibilityToolbar.jsx # Toolbar flutuante de acesso rápido
│   └── SkipToContent.jsx        # Link de pular para conteúdo
├── hooks/
│   └── useKeyboardShortcuts.js  # Atalhos de teclado
/src/styles/
└── theme.css                    # Estilos CSS de acessibilidade
```

### Context API

O `SettingsContext` gerencia todas as configurações:

```javascript
const settings = {
  darkMode: false,
  autoTheme: false,
  fontSize: 'medium',
  lineHeight: 'normal',
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
  language: 'pt-BR',
  soundNotifications: true,
  pushNotifications: true,
  emailNotifications: true,
  dataSaver: false,
  colorTheme: 'default'
};
```

### Funções Disponíveis

- `updateSetting(key, value)`: Atualiza uma configuração específica
- `resetSettings()`: Restaura todas as configurações para o padrão
- `increaseFontSize()`: Aumenta o tamanho da fonte em um nível
- `decreaseFontSize()`: Diminui o tamanho da fonte em um nível

### Classes CSS Aplicadas

- `.dark`: Modo escuro ativado
- `.high-contrast`: Alto contraste ativado
- `.reduce-motion`: Animações reduzidas
- `.data-saver`: Economia de dados ativada
- `[data-font-size="..."]`: Tamanho da fonte atual
- `[data-line-height="..."]`: Espaçamento de linha atual
- `[data-color-theme="..."]`: Tema de cor atual

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome/Edge (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)
- ✅ Electron (aplicação desktop)

### Leitores de Tela Testados
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)

## 📱 Responsividade

Todas as configurações funcionam perfeitamente em:
- 💻 Desktop (1920x1080 e superiores)
- 💻 Laptop (1366x768)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667 e superiores)

## 🔐 Privacidade

- Todas as configurações são armazenadas localmente no seu dispositivo
- Nenhuma configuração é enviada para servidores externos
- Você tem controle total sobre suas preferências

## 🆘 Suporte

Se você encontrar problemas ou tiver sugestões:
1. Acesse a página de "Suporte" na aplicação
2. Consulte o FAQ integrado
3. Entre em contato com a equipe de suporte

## 📝 Changelog

### Versão Atual
- ✅ Tema automático (seguir sistema)
- ✅ 5 temas de cores personalizados
- ✅ Controle de espaçamento de linha
- ✅ Economia de dados
- ✅ Configurações de notificações (som, push, email)
- ✅ Exportar/Importar configurações
- ✅ Atalhos de teclado
- ✅ Toolbar de acessibilidade flutuante
- ✅ Suporte completo a leitores de tela

### Planejado
- 🔄 Tradução completa da interface (multi-idioma)
- 🔄 Mais opções de temas de cores
- 🔄 Configurações de privacidade
- 🔄 Sincronização de configurações em nuvem (opcional)

## 🎓 Boas Práticas

### Para Desenvolvedores

1. **Sempre teste com leitores de tela**
2. **Respeite as preferências do usuário**: Use as classes CSS apropriadas
3. **Mantenha a semântica HTML**: Use tags apropriadas
4. **Forneça alternativas**: Texto alternativo para imagens, labels para inputs
5. **Teste os atalhos de teclado**: Garanta que funcionem em todos os contextos

### Para Usuários

1. **Explore as opções**: Teste diferentes combinações
2. **Faça backup**: Exporte suas configurações regularmente
3. **Use os atalhos**: Aprenda os atalhos de teclado para maior produtividade
4. **Reporte problemas**: Ajude a melhorar a acessibilidade

## 📚 Recursos Adicionais

### Padrões de Acessibilidade
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Ferramentas de Teste
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [Lighthouse (Chrome DevTools)](https://developers.google.com/web/tools/lighthouse)

---

**Última atualização**: Janeiro 2026
**Versão do documento**: 1.0
