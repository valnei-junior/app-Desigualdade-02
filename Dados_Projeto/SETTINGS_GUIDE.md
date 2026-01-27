# Página de Configurações de Acessibilidade

## ✨ Recursos Implementados

### 1. **Modo Escuro / Claro**
- Toggle entre temas claro e escuro
- Persiste a preferência do usuário
- Atalho: `Ctrl + D`

### 2. **Controle de Tamanho de Fonte**
- 4 tamanhos disponíveis: Pequeno, Médio, Grande, Extra Grande
- Botões de aumento (+) e diminuição (-)
- Preview em tempo real
- Atalhos: `Ctrl + +` e `Ctrl + -`

### 3. **Alto Contraste**
- Modo de alto contraste para melhor legibilidade
- Cores otimizadas para acessibilidade
- Funciona em modo claro e escuro

### 4. **Redução de Animações**
- Desabilita ou reduz animações
- Ideal para pessoas sensíveis a movimento
- Remove transições e animações desnecessárias

### 5. **Modo Leitor de Tela**
- Otimizações para NVDA, JAWS e outros leitores
- Melhora a navegação por teclado
- Adiciona labels ARIA apropriados

### 6. **Seleção de Idioma**
- Português (Brasil)
- English (US)
- Español
- Français
- *Nota: Implementação de i18n pode ser adicionada futuramente*

### 7. **Atalhos de Teclado**
- Documentação completa de atalhos
- Navegação rápida por teclado
- Acessível e intuitivo

## 🎯 Como Usar

### Acesso à Página de Configurações:

1. **Desktop:** 
   - Clique no ícone de engrenagem (⚙️) no header
   - Ou no menu lateral esquerdo

2. **Mobile:**
   - Abra o menu hambúrguer
   - Role até o final e clique em "Configurações"

3. **Barra Flutuante:**
   - Botão flutuante de acessibilidade (👁️) no canto inferior direito
   - Acesso rápido aos controles principais

### Atalhos de Teclado:

| Ação | Atalho |
|------|--------|
| Aumentar fonte | `Ctrl + +` |
| Diminuir fonte | `Ctrl + -` |
| Alternar modo escuro | `Ctrl + D` |
| Ir para navegação | `Alt + N` |
| Ir para conteúdo | `Alt + C` |
| Fechar modal | `ESC` |

## 🧩 Componentes Criados

### 1. **SettingsContext.jsx**
```javascript
// Gerencia todas as configurações de acessibilidade
// Salva no localStorage
// Aplica mudanças automaticamente ao DOM
```

### 2. **SettingsPage.jsx**
```javascript
// Página completa de configurações
// Interface intuitiva com cards organizados
// Preview de mudanças em tempo real
```

### 3. **AccessibilityToolbar.jsx**
```javascript
// Barra flutuante de acesso rápido
// Controles principais de acessibilidade
// Sempre acessível em qualquer página
```

### 4. **useKeyboardShortcuts.js**
```javascript
// Hook para atalhos de teclado globais
// Detecta combinações Ctrl/Alt
// Navegação por teclado otimizada
```

## 💾 Persistência de Dados

As configurações são automaticamente salvas no `localStorage`:

```javascript
{
  "darkMode": false,
  "fontSize": "medium",
  "highContrast": false,
  "reduceMotion": false,
  "screenReader": false,
  "language": "pt-BR"
}
```

## 🎨 Customização CSS

Classes CSS aplicadas automaticamente:

```css
/* Classes raiz */
html.dark { /* modo escuro */ }
html[data-font-size="large"] { /* fonte grande */ }
.high-contrast { /* alto contraste */ }
.reduce-motion * { /* sem animações */ }
```

## 🚀 Próximos Passos (Sugestões)

1. **Internacionalização (i18n)**
   - Implementar react-i18next
   - Traduzir todas as strings da aplicação

2. **Mais Opções de Tema**
   - Temas coloridos personalizados
   - Editor de cores customizado

3. **Zoom da Interface**
   - Zoom geral da aplicação (além do texto)
   - Útil para usuários com baixa visão

4. **Configurações de Notificação**
   - Controlar sons
   - Frequência de notificações

5. **Exportar/Importar Configurações**
   - Backup de preferências
   - Compartilhar entre dispositivos

## ♿ WCAG Compliance

Recursos implementados para conformidade com WCAG 2.1:

- ✅ Contraste adequado (AA/AAA)
- ✅ Navegação por teclado completa
- ✅ Labels ARIA
- ✅ Focus visível
- ✅ Tamanhos de alvo de toque adequados (mobile)
- ✅ Redução de movimento
- ✅ Texto redimensionável

## 📱 Responsividade

A página de configurações é totalmente responsiva:
- Layout adaptado para mobile, tablet e desktop
- Botões de toque otimizados (44x44px mínimo)
- Navegação simplificada em telas pequenas

## 🧪 Testando

Para testar os recursos de acessibilidade:

1. **Navegação por Teclado:** Use apenas Tab/Shift+Tab/Enter
2. **Leitor de Tela:** Teste com NVDA (Windows) ou VoiceOver (Mac)
3. **Alto Contraste:** Verifique legibilidade
4. **Diferentes Tamanhos:** Teste todos os tamanhos de fonte
5. **Redução de Movimento:** Desative e veja diferença nas animações
