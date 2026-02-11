#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:4000';

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}   🧪 TESTE DE UPLOAD REAL - VERSÃO SIMPLIFICADA${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

async function createTestPDF() {
  const pdfPath = path.join(__dirname, 'curriculum_teste.pdf');
  
  const pdfContent = Buffer.from(
    '%PDF-1.4\n' +
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\n' +
    'xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\n' +
    'trailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF'
  );
  
  fs.writeFileSync(pdfPath, pdfContent);
  return pdfPath;
}

async function testSimplePost() {
  try {
    console.log(`${colors.cyan}[TESTE 1]${colors.reset} POST simples para /api/upload-resume...`);
    
    const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-FileName': 'curriculum.pdf'
      },
      body: JSON.stringify({
        userId: 'user_123',
        fileName: 'curriculum_teste.pdf'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ Status: ${response.status}${colors.reset}`);
      console.log(`${colors.green}   Resposta:${colors.reset}`);
      console.log(`${colors.green}   ${JSON.stringify(data, null, 2)}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Status: ${response.status}${colors.reset}`);
      console.log(`${colors.yellow}   ${JSON.stringify(data)}${colors.reset}\n`);
    }
    
  } catch (error) {
    console.log(`${colors.red}❌ Erro: ${error.message}${colors.reset}\n`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`${colors.yellow}💡 Backend não está rodando. Execute:${colors.reset}`);
      console.log(`${colors.yellow}   cd backend && npm start${colors.reset}\n`);
    }
  }
}

async function testWithBinaryData() {
  try {
    console.log(`${colors.cyan}[TESTE 2]${colors.reset} POST com dados binários...`);
    
    const pdfPath = await createTestPDF();
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    console.log(`   Arquivo: ${pdfPath} (${pdfBuffer.length} bytes)`);
    
    const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-FileName': 'curriculum_teste.pdf'
      },
      body: pdfBuffer
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`${colors.green}✅ Upload bem-sucedido! Status: ${response.status}${colors.reset}`);
      console.log(`${colors.green}   File ID: ${data.fileId}${colors.reset}`);
      console.log(`${colors.green}   URL: ${data.url}${colors.reset}`);
      console.log(`${colors.green}   Signed URL: ${data.signedUrl}${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Status: ${response.status}${colors.reset}`);
      console.log(`${colors.yellow}   ${JSON.stringify(data)}${colors.reset}\n`);
    }
    
    // Limpar arquivo
    fs.unlinkSync(pdfPath);
    console.log(`${colors.cyan}🗑️  Arquivo de teste removido${colors.reset}\n`);
    
  } catch (error) {
    console.log(`${colors.red}❌ Erro: ${error.message}${colors.reset}\n`);
  }
}

async function runTests() {
  try {
    console.log(`${colors.cyan}Testando backend em ${API_BASE_URL}...${colors.reset}\n`);
    
    // Teste 1: POST simples
    await testSimplePost();
    
    // Teste 2: POST com dados binários
    await testWithBinaryData();
    
    console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}✅ TESTES CONCLUÍDOS${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}Erro geral: ${error.message}${colors.reset}`);
  }
}

runTests();
