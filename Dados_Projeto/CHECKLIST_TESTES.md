# ✅ Checklist de Testes - Configurações e Acessibilidade

Use este checklist para validar todas as funcionalidades da página de configurações.

## 🧪 Testes Funcionais

### 1. Aparência

#### Tema Automático
- [ ] Ativar "Tema Automático"
- [ ] Verificar se o toggle "Modo Escuro" fica desabilitado
- [ ] Alterar tema do SO para escuro
- [ ] Verificar se a aplicação muda para modo escuro automaticamente
- [ ] Alterar tema do SO para claro
- [ ] Verificar se a aplicação muda para modo claro automaticamente
- [ ] Desativar "Tema Automático"
- [ ] Verificar se o toggle "Modo Escuro" fica habilitado novamente

#### Modo Escuro/Claro
- [ ] Desativar "Tema Automático" (se estiver ativo)
- [ ] Ativar "Modo Escuro"
- [ ] Verificar se a interface muda para tema escuro
- [ ] Verificar se o ícone muda de Sol para Lua
- [ ] Verificar toast de confirmação
- [ ] Desativar "Modo Escuro"
- [ ] Verificar se a interface volta para tema claro
- [ ] Testar atalho `Ctrl + D`
- [ ] Verificar se o tema alterna corretamente

#### Alto Contraste
- [ ] Ativar "Alto Contraste"
- [ ] Verificar se os textos ficam mais contrastados
- [ ] Verificar se as bordas ficam mais espessas
- [ ] Verificar funcionamento em modo claro
- [ ] Verificar funcionamento em modo escuro
- [ ] Desativar "Alto Contraste"
- [ ] Verificar retorno ao contraste normal

### 2. Tema de Cores

- [ ] Clicar no tema "Padrão"
- [ ] Verificar aplicação do tema
- [ ] Clicar no tema "Azul"
- [ ] Verificar mudança de cor primária
- [ ] Verificar toast "Tema Azul aplicado!"
- [ ] Clicar no tema "Verde"
- [ ] Verificar mudança de cor
- [ ] Clicar no tema "Roxo"
- [ ] Verificar mudança de cor
- [ ] Clicar no tema "Laranja"
- [ ] Verificar mudança de cor
- [ ] Verificar se o check (✓) aparece no tema selecionado
- [ ] Testar todos os temas em modo escuro
- [ ] Testar todos os temas em modo claro

### 3. Tamanho do Texto

#### Controles Manuais
- [ ] Verificar tamanho inicial (geralmente "Médio")
- [ ] Clicar no botão "-" (diminuir)
- [ ] Verificar se o badge atualiza
- [ ] Verificar se o texto da preview diminui
- [ ] Verificar se o texto de toda a aplicação diminui
- [ ] Continuar clicando até chegar em "Pequeno"
- [ ] Verificar se o botão "-" fica desabilitado
- [ ] Clicar no botão "+" (aumentar)
- [ ] Verificar se o texto aumenta
- [ ] Continuar clicando até chegar em "Extra Grande"
- [ ] Verificar se o botão "+" fica desabilitado
- [ ] Verificar preview do texto

#### Atalhos de Teclado
- [ ] Pressionar `Ctrl + +`
- [ ] Verificar se a fonte aumenta
- [ ] Continuar até o máximo
- [ ] Verificar se não ultrapassa "Extra Grande"
- [ ] Pressionar `Ctrl + -`
- [ ] Verificar se a fonte diminui
- [ ] Continuar até o mínimo
- [ ] Verificar se não ultrapassa "Pequeno"

### 4. Espaçamento de Linha

- [ ] Clicar em "Compacto"
- [ ] Verificar se o check (✓) aparece
- [ ] Ler o texto da preview - deve estar mais compacto
- [ ] Navegar para outra página
- [ ] Verificar se o espaçamento está aplicado
- [ ] Voltar às configurações
- [ ] Clicar em "Normal"
- [ ] Verificar mudança no espaçamento
- [ ] Clicar em "Confortável"
- [ ] Verificar espaçamento mais amplo
- [ ] Comparar com outras páginas da aplicação

### 5. Animações e Movimento

#### Reduzir Animações
- [ ] Observar animações na aplicação (hover, transições, etc.)
- [ ] Ativar "Reduzir Animações"
- [ ] Verificar se as transições param
- [ ] Navegar entre páginas
- [ ] Verificar se não há animações de transição
- [ ] Hover sobre botões
- [ ] Verificar se não há animações de hover
- [ ] Desativar "Reduzir Animações"
- [ ] Verificar retorno das animações

### 6. Tecnologias Assistivas

#### Modo Leitor de Tela
- [ ] Ativar "Modo Leitor de Tela"
- [ ] Abrir leitor de tela (NVDA, JAWS, VoiceOver)
- [ ] Navegar pela aplicação
- [ ] Verificar se os labels estão corretos
- [ ] Verificar anúncios de mudanças
- [ ] Testar formulários
- [ ] Testar botões
- [ ] Desativar leitor de tela
- [ ] Desativar "Modo Leitor de Tela"

### 7. Notificações

#### Notificações Sonoras
- [ ] Ativar "Notificações Sonoras"
- [ ] Executar ação que gera notificação
- [ ] Verificar se som é reproduzido (se implementado)
- [ ] Desativar "Notificações Sonoras"
- [ ] Verificar que som não é reproduzido

#### Notificações Push
- [ ] Ativar "Notificações Push"
- [ ] Verificar mudança de estado
- [ ] Desativar "Notificações Push"
- [ ] Verificar mudança de estado

#### Notificações por Email
- [ ] Ativar "Notificações por Email"
- [ ] Verificar mudança de estado
- [ ] Desativar "Notificações por Email"
- [ ] Verificar mudança de estado

### 8. Economia de Dados

- [ ] Ativar "Modo Economia de Dados"
- [ ] Verificar se ícone muda para WifiOff
- [ ] Verificar se imagens ficam em escala de cinza (50%)
- [ ] Navegar para páginas com imagens
- [ ] Verificar efeito nas imagens
- [ ] Desativar "Modo Economia de Dados"
- [ ] Verificar retorno ao normal

### 9. Idioma

- [ ] Clicar em "Português (Brasil)" 🇧🇷
- [ ] Verificar se o check (✓) aparece
- [ ] Clicar em "English (US)" 🇺🇸
- [ ] Verificar mudança (futura - interface ainda em PT)
- [ ] Clicar em "Español" 🇪🇸
- [ ] Verificar mudança
- [ ] Clicar em "Français" 🇫🇷
- [ ] Verificar mudança
- [ ] Voltar para "Português (Brasil)"

### 10. Atalhos de Teclado

#### Testar Cada Atalho
- [ ] `Ctrl + +` - Aumentar fonte
- [ ] `Ctrl + -` - Diminuir fonte
- [ ] `Ctrl + D` - Toggle modo escuro
- [ ] `Alt + N` - Ir para navegação
- [ ] `Alt + C` - Ir para conteúdo principal
- [ ] `ESC` - Fechar modal (abrir um modal primeiro)

#### Compatibilidade
- [ ] Testar em Windows (Ctrl)
- [ ] Testar em macOS (Cmd)
- [ ] Verificar conflitos com atalhos do navegador

### 11. Backup de Configurações

#### Exportar
- [ ] Configurar algumas preferências customizadas
- [ ] Clicar em "Exportar Configurações"
- [ ] Verificar se arquivo JSON é baixado
- [ ] Verificar toast "Configurações exportadas com sucesso!"
- [ ] Abrir arquivo JSON
- [ ] Verificar se contém todas as configurações

#### Importar
- [ ] Mudar algumas configurações
- [ ] Clicar em "Importar Configurações"
- [ ] Selecionar arquivo JSON exportado anteriormente
- [ ] Verificar toast "Configurações importadas com sucesso!"
- [ ] Verificar se todas as configurações foram restauradas
- [ ] Verificar se a interface reflete as mudanças

#### Erro de Importação
- [ ] Tentar importar arquivo inválido
- [ ] Verificar toast de erro
- [ ] Verificar que configurações não mudaram

### 12. Restaurar Padrões

- [ ] Customizar várias configurações
- [ ] Clicar em "Restaurar Configurações Padrão"
- [ ] Verificar toast "Configurações restauradas!"
- [ ] Verificar se todas as configurações voltaram ao padrão:
  - [ ] darkMode: false
  - [ ] autoTheme: false
  - [ ] fontSize: medium
  - [ ] lineHeight: normal
  - [ ] highContrast: false
  - [ ] reduceMotion: false
  - [ ] screenReader: false
  - [ ] language: pt-BR
  - [ ] soundNotifications: true
  - [ ] pushNotifications: true
  - [ ] emailNotifications: true
  - [ ] dataSaver: false
  - [ ] colorTheme: default

### 13. Toolbar de Acessibilidade

#### Localização
- [ ] Verificar se o botão flutuante está visível
- [ ] Verificar posição (canto inferior direito)
- [ ] Em mobile: verificar se fica acima da navegação inferior

#### Funcionalidade
- [ ] Clicar no botão de acessibilidade (👁️)
- [ ] Verificar se popover abre
- [ ] Verificar título "Acesso Rápido"
- [ ] Testar controles de fonte (- e +)
- [ ] Verificar badge do tamanho atual
- [ ] Testar toggle de Modo Escuro
- [ ] Testar toggle de Alto Contraste
- [ ] Clicar em "Mais Configurações"
- [ ] Verificar se navega para `/configuracoes`
- [ ] Verificar se popover fecha

## 📱 Testes Responsivos

### Desktop (1920x1080)
- [ ] Visualizar layout em 2 colunas (tema de cores)
- [ ] Verificar espaçamento adequado
- [ ] Testar todos os componentes

### Laptop (1366x768)
- [ ] Verificar adaptação do layout
- [ ] Testar todos os componentes

### Tablet (768x1024)
- [ ] Verificar layout em coluna única
- [ ] Testar todos os componentes
- [ ] Verificar botões de toque

### Mobile (375x667)
- [ ] Verificar layout mobile
- [ ] Testar todos os componentes
- [ ] Verificar toolbar de acessibilidade
- [ ] Verificar navegação inferior

## 🔍 Testes de Acessibilidade

### Navegação por Teclado
- [ ] Tab através de todos os elementos
- [ ] Verificar ordem lógica de tabulação
- [ ] Verificar foco visível (outline)
- [ ] Shift + Tab para voltar
- [ ] Enter para ativar botões
- [ ] Espaço para ativar switches
- [ ] Testar todos os atalhos

### Leitor de Tela (NVDA/JAWS/VoiceOver)
- [ ] Ativar leitor de tela
- [ ] Navegar para a página de configurações
- [ ] Verificar anúncio do título da página
- [ ] Navegar por cada seção (h2, h3)
- [ ] Verificar labels de cada switch
- [ ] Verificar descrições de ajuda
- [ ] Verificar anúncios de estado (ativado/desativado)
- [ ] Testar botões
- [ ] Testar campos de seleção
- [ ] Verificar toasts/notificações

### Contraste
- [ ] Usar ferramenta de verificação de contraste
- [ ] Verificar modo claro atende WCAG AA (4.5:1)
- [ ] Verificar modo escuro atende WCAG AA
- [ ] Verificar modo alto contraste atende WCAG AAA (7:1)
- [ ] Testar todos os componentes
- [ ] Verificar cores dos temas personalizados

### Zoom
- [ ] Zoom 100% - verificar layout
- [ ] Zoom 150% - verificar adaptação
- [ ] Zoom 200% - verificar usabilidade
- [ ] Zoom 300% - verificar conteúdo visível
- [ ] Verificar se nada quebra
- [ ] Verificar scroll horizontal (não deve ter)

## 💾 Testes de Persistência

### LocalStorage
- [ ] Configurar preferências
- [ ] Recarregar página (F5)
- [ ] Verificar se configurações permanecem
- [ ] Fechar navegador/app
- [ ] Reabrir
- [ ] Verificar se configurações permanecem
- [ ] Limpar localStorage
- [ ] Recarregar
- [ ] Verificar se volta aos padrões

### Export/Import
- [ ] Exportar configurações
- [ ] Limpar localStorage
- [ ] Importar configurações
- [ ] Verificar se tudo foi restaurado

## 🌐 Testes em Navegadores

### Chrome
- [ ] Testar todas as funcionalidades
- [ ] Verificar console (sem erros)
- [ ] Testar DevTools

### Firefox
- [ ] Testar todas as funcionalidades
- [ ] Verificar console
- [ ] Testar atalhos

### Safari
- [ ] Testar todas as funcionalidades
- [ ] Verificar compatibilidade CSS
- [ ] Testar em macOS

### Edge
- [ ] Testar todas as funcionalidades
- [ ] Verificar compatibilidade

### Electron (App Desktop)
- [ ] Testar todas as funcionalidades
- [ ] Verificar persistência
- [ ] Testar atalhos nativos

## ⚡ Testes de Performance

### Carregamento
- [ ] Medir tempo de carregamento da página
- [ ] Verificar se é < 2 segundos
- [ ] Verificar Network tab (sem requisições desnecessárias)

### Mudança de Configurações
- [ ] Medir tempo de aplicação das mudanças
- [ ] Deve ser instantâneo (< 100ms)
- [ ] Verificar sem lag visual

### localStorage
- [ ] Verificar tamanho dos dados salvos
- [ ] Deve ser < 10KB
- [ ] Verificar velocidade de leitura/escrita

## 🐛 Testes de Edge Cases

### Configurações Extremas
- [ ] Ativar TODAS as configurações de acessibilidade
- [ ] Verificar se a aplicação funciona
- [ ] Desativar TODAS as configurações
- [ ] Verificar se funciona
- [ ] Testar combinações incomuns:
  - [ ] Alto contraste + Modo escuro + Fonte XL
  - [ ] Economia de dados + Todos os temas
  - [ ] Reduzir movimento + Modo escuro

### Dados Corrompidos
- [ ] Editar localStorage manualmente com dados inválidos
- [ ] Recarregar aplicação
- [ ] Verificar se volta aos padrões (fallback)
- [ ] Verificar se não quebra

### Importação de Dados Antigos
- [ ] Criar JSON com configurações antigas (versão anterior)
- [ ] Importar
- [ ] Verificar se migra corretamente
- [ ] Verificar fallback para novas configurações

## 📊 Checklist de Qualidade

### Código
- [ ] Sem erros no console
- [ ] Sem warnings no console
- [ ] Código está comentado onde necessário
- [ ] Não há console.logs de debug

### UX
- [ ] Feedback visual para todas as ações
- [ ] Toasts aparecem para confirmações
- [ ] Estados de loading (se aplicável)
- [ ] Mensagens de erro claras

### UI
- [ ] Design consistente com resto da aplicação
- [ ] Espaçamento uniforme
- [ ] Cores seguem tema
- [ ] Ícones apropriados
- [ ] Tipografia correta

### Acessibilidade
- [ ] WCAG 2.1 Nível AA atendido
- [ ] Navegação por teclado funcional
- [ ] Leitores de tela funcionam
- [ ] Contraste adequado
- [ ] Focus visível

### Documentação
- [ ] README atualizado
- [ ] Guia de configurações completo
- [ ] Exemplos de uso documentados
- [ ] Comentários no código

## ✅ Aprovação Final

Após completar todos os testes acima:

- [ ] Todas as funcionalidades estão funcionando
- [ ] Não há bugs conhecidos
- [ ] Acessibilidade validada
- [ ] Performance aceitável
- [ ] Documentação completa
- [ ] Código revisado
- [ ] Pronto para produção

---

**Data do Teste**: ___/___/___  
**Testador**: _________________  
**Versão**: 1.0.0  
**Status**: [ ] Aprovado [ ] Reprovado

**Bugs Encontrados**:
```
1. 
2. 
3. 
```

**Observações**:
```


```
