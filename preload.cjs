const { contextBridge } = require('electron');

// Expor APIs seguras para o renderer process se necessário
contextBridge.exposeInMainWorld('electron', {
  // Adicione suas APIs aqui quando necessário
  platform: process.platform
});
