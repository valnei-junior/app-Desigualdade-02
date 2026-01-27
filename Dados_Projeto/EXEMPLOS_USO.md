# 🔧 Exemplos de Uso - Sistema de Configurações

Este documento fornece exemplos práticos de como usar e estender o sistema de configurações da aplicação CarreiraHub.

## 📋 Índice

- [Usando o Context de Configurações](#usando-o-context-de-configurações)
- [Criando Novos Componentes Acessíveis](#criando-novos-componentes-acessíveis)
- [Adicionando Novas Configurações](#adicionando-novas-configurações)
- [Aplicando Estilos Condicionais](#aplicando-estilos-condicionais)
- [Testando Acessibilidade](#testando-acessibilidade)

## 🎯 Usando o Context de Configurações

### Exemplo Básico

```jsx
import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';

function MeuComponente() {
  const { settings, updateSetting } = useSettings();
  
  return (
    <div>
      <p>Modo Escuro: {settings.darkMode ? 'Ativado' : 'Desativado'}</p>
      <p>Tamanho da Fonte: {settings.fontSize}</p>
      
      <button onClick={() => updateSetting('darkMode', !settings.darkMode)}>
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default MeuComponente;
```

### Usando Todas as Configurações

```jsx
import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';

function ConfiguracoesCompletas() {
  const { 
    settings, 
    updateSetting, 
    resetSettings,
    increaseFontSize,
    decreaseFontSize 
  } = useSettings();
  
  return (
    <div>
      {/* Acessar uma configuração */}
      <div>Idioma: {settings.language}</div>
      
      {/* Atualizar uma configuração */}
      <button onClick={() => updateSetting('language', 'en-US')}>
        Mudar para Inglês
      </button>
      
      {/* Controlar tamanho de fonte */}
      <div className="flex gap-2">
        <button onClick={decreaseFontSize}>A-</button>
        <span>{settings.fontSize}</span>
        <button onClick={increaseFontSize}>A+</button>
      </div>
      
      {/* Resetar tudo */}
      <button onClick={resetSettings}>
        Restaurar Padrões
      </button>
    </div>
  );
}
```

## 🧩 Criando Novos Componentes Acessíveis

### Componente com Alto Contraste

```jsx
import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';

function CartaoAcessivel({ titulo, conteudo }) {
  const { settings } = useSettings();
  
  // Classes condicionais baseadas nas configurações
  const cardClasses = `
    p-4 rounded-lg border
    ${settings.highContrast ? 'border-4 border-black' : 'border-gray-200'}
    ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}
  `;
  
  return (
    <div className={cardClasses}>
      <h3 className="text-lg font-bold mb-2">{titulo}</h3>
      <p style={{ lineHeight: settings.lineHeight === 'relaxed' ? '1.8' : '1.6' }}>
        {conteudo}
      </p>
    </div>
  );
}
```

### Componente com Animações Opcionais

```jsx
import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';
import { motion } from 'motion/react';

function ComponenteAnimado({ children }) {
  const { settings } = useSettings();
  
  // Desabilita animações se reduceMotion estiver ativo
  const animationProps = settings.reduceMotion 
    ? {} 
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };
  
  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
}
```

### Componente com Notificações Sonoras

```jsx
import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';
import { toast } from 'sonner';

function NotificadorAcessivel() {
  const { settings } = useSettings();
  
  const notificar = (mensagem) => {
    // Mostra toast visual
    toast.success(mensagem);
    
    // Reproduz som se habilitado
    if (settings.soundNotifications) {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(err => console.log('Erro ao reproduzir som:', err));
    }
    
    // Anuncia para leitores de tela se habilitado
    if (settings.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.textContent = mensagem;
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }
  };
  
  return (
    <button onClick={() => notificar('Ação concluída com sucesso!')}>
      Executar Ação
    </button>
  );
}
```

## ➕ Adicionando Novas Configurações

### Passo 1: Atualizar o SettingsContext

```jsx
// Em /src/app/contexts/SettingsContext.jsx

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      // ... configurações existentes ...
      
      // ⭐ NOVA CONFIGURAÇÃO
      showAnimatedBackground: true,
      customFontFamily: 'system',
      compactMode: false
    };
  });
  
  // Aplicar nova configuração
  const applySettings = (settings) => {
    const root = document.documentElement;
    
    // ... aplicações existentes ...
    
    // ⭐ APLICAR NOVA CONFIGURAÇÃO
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Font family personalizada
    if (settings.customFontFamily !== 'system') {
      root.style.fontFamily = settings.customFontFamily;
    }
  };
  
  // ... resto do código ...
}
```

### Passo 2: Adicionar UI na SettingsPage

```jsx
// Em /src/app/components/SettingsPage.jsx

// Adicionar nova seção
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Layout className="w-5 h-5" />
      Modo Compacto
    </CardTitle>
    <CardDescription>
      Reduz espaçamentos para exibir mais conteúdo
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <label className="font-medium">Ativar Modo Compacto</label>
        <p className="text-sm text-muted-foreground">
          Diminui margens e paddings em toda a aplicação
        </p>
      </div>
      <Switch
        checked={settings.compactMode}
        onCheckedChange={(checked) => updateSetting('compactMode', checked)}
      />
    </div>
  </CardContent>
</Card>
```

### Passo 3: Adicionar CSS

```css
/* Em /src/styles/theme.css */

/* Modo Compacto */
.compact-mode {
  --spacing-base: 0.5rem;
}

.compact-mode .p-4 {
  padding: 0.75rem !important;
}

.compact-mode .p-6 {
  padding: 1rem !important;
}

.compact-mode .gap-4 {
  gap: 0.75rem !important;
}
```

## 🎨 Aplicando Estilos Condicionais

### Usando Classes Tailwind Condicionais

```jsx
function ComponenteEstilizado() {
  const { settings } = useSettings();
  
  return (
    <div className={`
      p-4 rounded-lg
      ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}
      ${settings.highContrast ? 'border-4 border-black' : 'border'}
      ${settings.fontSize === 'xlarge' ? 'text-2xl' : 'text-base'}
      transition-all
      ${settings.reduceMotion ? 'transition-none' : 'duration-300'}
    `}>
      Conteúdo
    </div>
  );
}
```

### Usando Estilos Inline Condicionais

```jsx
function ComponenteComEstiloInline() {
  const { settings } = useSettings();
  
  const estilos = {
    fontSize: settings.fontSize === 'small' ? '14px' : 
               settings.fontSize === 'large' ? '18px' : '16px',
    lineHeight: settings.lineHeight === 'compact' ? 1.4 : 
                settings.lineHeight === 'relaxed' ? 1.8 : 1.6,
    transition: settings.reduceMotion ? 'none' : 'all 0.3s ease'
  };
  
  return (
    <div style={estilos}>
      Conteúdo com estilos dinâmicos
    </div>
  );
}
```

### Usando CSS Variables

```jsx
function ComponenteComVariaveis() {
  const { settings } = useSettings();
  
  // Definir variáveis CSS customizadas
  const cssVars = {
    '--custom-spacing': settings.compactMode ? '0.5rem' : '1rem',
    '--custom-border-width': settings.highContrast ? '3px' : '1px'
  };
  
  return (
    <div style={cssVars} className="custom-component">
      <div className="inner-content">
        Conteúdo
      </div>
    </div>
  );
}
```

## 🧪 Testando Acessibilidade

### Hook Personalizado para Testes

```jsx
// /src/app/hooks/useAccessibilityTest.js
import { useSettings } from '@/app/contexts/SettingsContext';
import { useEffect } from 'react';

export function useAccessibilityTest() {
  const { settings } = useSettings();
  
  useEffect(() => {
    // Log de configurações de acessibilidade
    console.group('Configurações de Acessibilidade');
    console.log('Alto Contraste:', settings.highContrast);
    console.log('Reduzir Movimento:', settings.reduceMotion);
    console.log('Modo Escuro:', settings.darkMode);
    console.log('Tamanho da Fonte:', settings.fontSize);
    console.log('Leitor de Tela:', settings.screenReader);
    console.groupEnd();
    
    // Verificar contraste
    if (settings.highContrast) {
      console.warn('Modo Alto Contraste ativado - verifique todos os textos');
    }
    
    // Verificar animações
    if (settings.reduceMotion) {
      console.info('Animações reduzidas - transições desabilitadas');
    }
  }, [settings]);
  
  return settings;
}
```

### Componente de Debug

```jsx
import React, { useState } from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';

function DebugAcessibilidade() {
  const { settings } = useSettings();
  const [mostrar, setMostrar] = useState(false);
  
  if (!mostrar) {
    return (
      <button 
        onClick={() => setMostrar(true)}
        className="fixed bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded"
      >
        Debug
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Debug de Acessibilidade</h3>
        <button onClick={() => setMostrar(false)}>✕</button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">Modo Escuro:</span>
          <span>{settings.darkMode ? '✅' : '❌'}</span>
          
          <span className="font-medium">Alto Contraste:</span>
          <span>{settings.highContrast ? '✅' : '❌'}</span>
          
          <span className="font-medium">Reduzir Movimento:</span>
          <span>{settings.reduceMotion ? '✅' : '❌'}</span>
          
          <span className="font-medium">Leitor de Tela:</span>
          <span>{settings.screenReader ? '✅' : '❌'}</span>
          
          <span className="font-medium">Tamanho Fonte:</span>
          <span className="uppercase">{settings.fontSize}</span>
          
          <span className="font-medium">Espaçamento:</span>
          <span className="uppercase">{settings.lineHeight}</span>
          
          <span className="font-medium">Tema:</span>
          <span className="uppercase">{settings.colorTheme}</span>
          
          <span className="font-medium">Economia Dados:</span>
          <span>{settings.dataSaver ? '✅' : '❌'}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-600">
          Classes aplicadas: {document.documentElement.classList.toString()}
        </p>
      </div>
    </div>
  );
}

export default DebugAcessibilidade;
```

### Teste de Contraste

```jsx
function TesteDeContraste() {
  const { settings } = useSettings();
  
  const verificarContraste = (corFundo, corTexto) => {
    // Implementação simplificada - use uma lib real para produção
    // Como: https://www.npmjs.com/package/color-contrast-checker
    
    const getLuminance = (hex) => {
      // Conversão simplificada
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };
    
    const l1 = getLuminance(corFundo);
    const l2 = getLuminance(corTexto);
    const contraste = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return {
      ratio: contraste.toFixed(2),
      passaWCAG_AA: contraste >= 4.5,
      passaWCAG_AAA: contraste >= 7
    };
  };
  
  const resultado = verificarContraste('#ffffff', '#000000');
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Teste de Contraste</h3>
      <p>Ratio: {resultado.ratio}:1</p>
      <p>WCAG AA: {resultado.passaWCAG_AA ? '✅' : '❌'}</p>
      <p>WCAG AAA: {resultado.passaWCAG_AAA ? '✅' : '❌'}</p>
    </div>
  );
}
```

## 📱 Exemplo de Integração Completa

```jsx
import React from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

function ExemploCompleto() {
  const { 
    settings, 
    updateSetting, 
    increaseFontSize, 
    decreaseFontSize 
  } = useSettings();
  
  // Função de notificação acessível
  const notificarAcessivel = (mensagem, tipo = 'success') => {
    toast[tipo](mensagem);
    
    // Som se habilitado
    if (settings.soundNotifications) {
      const audio = new Audio(`/sounds/${tipo}.mp3`);
      audio.play().catch(() => {});
    }
    
    // Anúncio para leitor de tela
    if (settings.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'alert');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = mensagem;
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 3000);
    }
  };
  
  // Classes condicionais
  const containerClasses = `
    p-6 rounded-lg space-y-4
    ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
    ${settings.highContrast ? 'border-4 border-black' : 'border border-gray-200'}
    ${!settings.reduceMotion && 'transition-all duration-300'}
  `;
  
  return (
    <div className={containerClasses}>
      <h2 className="text-2xl font-bold">Exemplo Completo de Acessibilidade</h2>
      
      {/* Controles de Fonte */}
      <div className="flex items-center gap-4">
        <span>Tamanho da Fonte:</span>
        <Button 
          onClick={() => {
            decreaseFontSize();
            notificarAcessivel('Fonte diminuída');
          }}
          disabled={settings.fontSize === 'small'}
          aria-label="Diminuir tamanho da fonte"
        >
          A-
        </Button>
        <span className="font-mono">{settings.fontSize}</span>
        <Button 
          onClick={() => {
            increaseFontSize();
            notificarAcessivel('Fonte aumentada');
          }}
          disabled={settings.fontSize === 'xlarge'}
          aria-label="Aumentar tamanho da fonte"
        >
          A+
        </Button>
      </div>
      
      {/* Toggle de Configurações */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => {
              updateSetting('darkMode', e.target.checked);
              notificarAcessivel(
                e.target.checked ? 'Modo escuro ativado' : 'Modo claro ativado'
              );
            }}
            className="w-5 h-5"
          />
          <span>Modo Escuro</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => {
              updateSetting('highContrast', e.target.checked);
              notificarAcessivel(
                e.target.checked ? 'Alto contraste ativado' : 'Alto contraste desativado'
              );
            }}
            className="w-5 h-5"
          />
          <span>Alto Contraste</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={(e) => {
              updateSetting('reduceMotion', e.target.checked);
              notificarAcessivel(
                e.target.checked ? 'Animações reduzidas' : 'Animações ativadas'
              );
            }}
            className="w-5 h-5"
          />
          <span>Reduzir Animações</span>
        </label>
      </div>
      
      {/* Feedback Visual */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Status Atual</h3>
        <ul className="space-y-1 text-sm">
          <li>Modo: {settings.darkMode ? '🌙 Escuro' : '☀️ Claro'}</li>
          <li>Fonte: {settings.fontSize}</li>
          <li>Espaçamento: {settings.lineHeight}</li>
          <li>Tema: {settings.colorTheme}</li>
          <li>Idioma: {settings.language}</li>
        </ul>
      </Card>
      
      {/* Acessibilidade Screen Reader */}
      <div 
        role="region" 
        aria-label="Informações de acessibilidade"
        className="sr-only"
      >
        <p>
          Configurações atuais: Modo {settings.darkMode ? 'escuro' : 'claro'}, 
          Tamanho de fonte {settings.fontSize}, 
          {settings.highContrast && 'Alto contraste ativado'}
        </p>
      </div>
    </div>
  );
}

export default ExemploCompleto;
```

## 🎓 Boas Práticas

### 1. Sempre Verifique as Configurações

```jsx
// ❌ MAU
function ComponenteRuim() {
  return <div className="transition-all duration-500">...</div>;
}

// ✅ BOM
function ComponenteBom() {
  const { settings } = useSettings();
  return (
    <div className={settings.reduceMotion ? '' : 'transition-all duration-500'}>
      ...
    </div>
  );
}
```

### 2. Use Semântica HTML Apropriada

```jsx
// ❌ MAU
<div onClick={handleClick}>Clique aqui</div>

// ✅ BOM
<button onClick={handleClick} aria-label="Executar ação">
  Clique aqui
</button>
```

### 3. Forneça Feedback Múltiplo

```jsx
// ✅ BOM - Visual, Sonoro e Leitor de Tela
function acaoComFeedback() {
  // Visual
  toast.success('Ação concluída!');
  
  // Sonoro
  if (settings.soundNotifications) {
    new Audio('/success.mp3').play();
  }
  
  // Leitor de tela
  if (settings.screenReader) {
    announce('Ação concluída com sucesso');
  }
}
```

### 4. Teste com Usuários Reais

- Teste com leitores de tela (NVDA, JAWS, VoiceOver)
- Teste apenas com teclado
- Teste com diferentes tamanhos de fonte
- Teste em modo alto contraste
- Teste com animações desabilitadas

---

**Dúvidas?** Consulte o [GUIA_CONFIGURACOES.md](./GUIA_CONFIGURACOES.md) ou abra uma issue no repositório.
