# Guia de Conversão TypeScript para JavaScript + Electron

## Visão Geral
Este projeto foi convertido de TypeScript para JavaScript e configurado para funcionar como aplicação Electron.

## Alterações Principais

### 1. Configuração do Electron

#### Arquivos Criados:
- `/electron.cjs` - Processo principal do Electron
- `/preload.cjs` - Script de preload para comunicação segura
- `/vite.config.js` - Configuração do Vite com plugins do Electron
- `/index.html` - HTML principal
- `/src/main.jsx` - Ponto de entrada React

#### Package.json Atualizado:
- Adicionados scripts: `electron:dev` e `electron:build`
- Configuração `build` para electron-builder
- Main entry point: `dist-electron/electron.cjs`

### 2. Conversão TypeScript → JavaScript

#### Regras de Conversão:

1. **Remover tipagens TypeScript:**
   ```typescript
   // ANTES (TypeScript)
   function Component({ title }: { title: string }) {
     const [count, setCount] = useState<number>(0);
   }
   
   // DEPOIS (JavaScript)
   function Component({ title }) {
     const [count, setCount] = useState(0);
   }
   ```

2. **Remover interfaces e types:**
   ```typescript
   // ANTES
   interface User {
     name: string;
     age: number;
   }
   
   // DEPOIS - usar JSDoc se quiser documentação
   /**
    * @typedef {Object} User
    * @property {string} name
    * @property {number} age
    */
   ```

3. **Renomear arquivos:**
   - `.tsx` → `.jsx` (componentes React)
   - `.ts` → `.js` (arquivos JavaScript puros)

4. **PropTypes (opcional para validação):**
   ```javascript
   import PropTypes from 'prop-types';
   
   Component.propTypes = {
     title: PropTypes.string.isRequired,
     count: PropTypes.number
   };
   ```

### 3. Estrutura de Arquivos

```
/
├── electron.cjs              # Main process do Electron
├── preload.cjs               # Preload script
├── vite.config.js            # Configuração Vite + Electron
├── index.html                # HTML principal
├── package.json              # Configuração npm com scripts Electron
└── src/
    ├── main.jsx              # Entry point React
    ├── app/
    │   ├── App.jsx           # Componente principal (convertido)
    │   ├── components/       # Todos os componentes (.tsx → .jsx)
    │   ├── contexts/         # Contextos React (.tsx → .jsx)
    │   └── data/             # Dados mock (.ts → .js)
    └── styles/               # CSS files (sem mudanças)
```

### 4. Scripts NPM

```bash
# Desenvolvimento
npm run dev              # Inicia Vite dev server + Electron

# Build de Produção
npm run build           # Cria build e empacota Electron app

# Apenas Vite
npm run preview         # Preview do build Vite
```

### 5. Passos para Conversão Manual dos Componentes

Para cada arquivo `.tsx` ou `.ts`:

1. **Abrir o arquivo**
2. **Remover todas as anotações de tipo:**
   - Remove `: Type` de parâmetros
   - Remove `<Type>` de generics
   - Remove `interface` e `type` declarations
   - Remove `as Type` assertions

3. **Salvar com nova extensão:**
   - `.tsx` → `.jsx`
   - `.ts` → `.js`

4. **Exemplos práticos:**

```javascript
// ANTES: /src/app/contexts/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface UserContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
}

// DEPOIS: /src/app/contexts/UserContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Remove interfaces, use objetos JavaScript diretos
```

```javascript
// ANTES: Component com props tipadas
export function Card({ title, description }: { title: string; description: string }) {
  return <div>{title}</div>;
}

// DEPOIS: Component sem tipagem
export function Card({ title, description }) {
  return <div>{title}</div>;
}
```

### 6. Configuração Electron Builder

O `package.json` já inclui a configuração do electron-builder:

```json
{
  "build": {
    "appId": "com.educacao.empregabilidade",
    "productName": "Plataforma Educação",
    "files": ["dist/**/*", "dist-electron/**/*"],
    "win": { "target": ["nsis"] },
    "mac": { "target": ["dmg"] },
    "linux": { "target": ["AppImage"] }
  }
}
```

### 7. APIs do Electron (Uso Futuro)

Se precisar acessar APIs do Electron no renderer:

```javascript
// Em preload.cjs - expor APIs seguras
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  // Adicione mais APIs conforme necessário
});

// No componente React
const platform = window.electron?.platform;
```

### 8. Script de Conversão Automática (Opcional)

Você pode criar um script Node.js para converter automaticamente:

```javascript
// convert.js
const fs = require('fs');
const path = require('path');

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove type annotations (básico)
  content = content.replace(/:\s*\w+(\[\])?/g, '');
  content = content.replace(/interface\s+\w+\s*{[^}]+}/g, '');
  content = content.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  
  // Determina nova extensão
  const newPath = filePath.replace(/\.tsx?$/, filePath.endsWith('.tsx') ? '.jsx' : '.js');
  
  fs.writeFileSync(newPath, content);
  console.log(`Converted: ${filePath} → ${newPath}`);
}

// Use com cuidado - faça backup primeiro!
```

### 9. Verificações Finais

Após conversão:

- [ ] Todos os arquivos .tsx convertidos para .jsx
- [ ] Todos os arquivos .ts convertidos para .js
- [ ] Imports atualizados (sem extensões .ts/.tsx)
- [ ] `npm install` executado
- [ ] `npm run dev` funciona
- [ ] `npm run build` cria executável Electron

### 10. Troubleshooting

**Erro: Cannot find module**
- Verifique se todos os imports foram atualizados (.tsx → .jsx)

**Electron não abre janela**
- Verifique electron.cjs e os caminhos de arquivo

**Erro de compilação TypeScript**
- Certifique-se de ter removido vite.config.ts e mantido apenas vite.config.js

## Conclusão

A aplicação está configurada para rodar como Electron app. Para finalizar a conversão:

1. Converta manualmente os arquivos restantes (ou use script)
2. Delete os arquivos TypeScript antigos (.ts, .tsx)
3. Delete vite.config.ts
4. Teste com `npm run dev`
5. Build com `npm run build`

A estrutura e funcionalidade permanecem as mesmas - apenas a sintaxe mudou de TypeScript para JavaScript.
