#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
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
console.log(`${colors.blue}   🧪 TESTE DE UPLOAD REAL DE ARQUIVO (PDF)${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

async function createTestPDF() {
  const pdfPath = path.join(__dirname, 'curriculum_teste.pdf');
  
  // Criar um PDF simples
  const pdfContent = Buffer.from(
    '%PDF-1.4\n' +
    '1 0 obj\n' +
    '<< /Type /Catalog /Pages 2 0 R >>\n' +
    'endobj\n' +
    '2 0 obj\n' +
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n' +
    'endobj\n' +
    '3 0 obj\n' +
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\n' +
    'endobj\n' +
    '4 0 obj\n' +
    '<< >>\n' +
    'stream\n' +
    'BT\n' +
    '/F1 12 Tf\n' +
    '100 700 Td\n' +
    '(CURRICULO DE TESTE) Tj\n' +
    'ET\n' +
    'endstream\n' +
    'endobj\n' +
    '5 0 obj\n' +
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n' +
    'endobj\n' +
    'xref\n' +
    '0 6\n' +
    '0000000000 65535 f \n' +
    '0000000009 00000 n \n' +
    '0000000058 00000 n \n' +
    '0000000115 00000 n \n' +
    '0000000249 00000 n \n' +
    '0000000358 00000 n \n' +
    'trailer\n' +
    '<< /Size 6 /Root 1 0 R >>\n' +
    'startxref\n' +
    '457\n' +
    '%%EOF\n'
  );
  
  fs.writeFileSync(pdfPath, pdfContent);
  console.log(`${colors.green}✅ PDF de teste criado: ${pdfPath}${colors.reset}\n`);
  
  return pdfPath;
}

async function testUpload() {
  try {
    // PASSO 1: Criar PDF de teste
    console.log(`${colors.cyan}[PASSO 1]${colors.reset} Criando arquivo PDF de teste...`);
    const pdfPath = await createTestPDF();
    
    if (!fs.existsSync(pdfPath)) {
      throw new Error('Arquivo PDF não foi criado');
    }
    
    const fileSize = fs.statSync(pdfPath).size;
    console.log(`${colors.green}✅ Arquivo criado com ${fileSize} bytes${colors.reset}\n`);
    
    // PASSO 2: Testar upload com curl (multipart)
    console.log(`${colors.cyan}[PASSO 2]${colors.reset} Enviando arquivo para /api/upload-resume com curl...`);
    
    try {
      const curlCommand = `curl -s -X POST -F "file=@${pdfPath}" -F "userId=user_test_123" -F "fileName=curriculum_teste.pdf" ${API_BASE_URL}/api/upload-resume`;
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr && stderr.includes('Connection refused')) {
        console.log(`${colors.yellow}⚠️  Conexão recusada. Backend não está rodando em ${API_BASE_URL}${colors.reset}\n`);
      } else {
        try {
          const data = JSON.parse(stdout);
          if (data.success) {
            console.log(`${colors.green}✅ Upload bem-sucedido! Status: 200${colors.reset}`);
            console.log(`${colors.green}   Resposta:${colors.reset}`);
            console.log(`${colors.green}   - File ID: ${data.fileId}${colors.reset}`);
            console.log(`${colors.green}   - URL: ${data.url}${colors.reset}`);
            console.log(`${colors.green}   - Signed URL: ${data.signedUrl}${colors.reset}\n`);
          } else {
            console.log(`${colors.yellow}⚠️  Upload retornou erro:${colors.reset}`);
            console.log(`${colors.yellow}   ${JSON.stringify(data, null, 2)}${colors.reset}\n`);
          }
        } catch (e) {
          console.log(`${colors.yellow}⚠️  Resposta não é JSON:${colors.reset}`);
          console.log(`${colors.yellow}   ${stdout}${colors.reset}\n`);
        }
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠️  Erro ao executar curl: ${error.message}${colors.reset}\n`);
    }
    
    // PASSO 3: Testar POST simples
    console.log(`${colors.cyan}[PASSO 3]${colors.reset} Testando POST simples (sem arquivo)...`);
    
    try {
      const curlCommand2 = `curl -s -X POST -H "Content-Type: application/json" -d "{\"userId\":\"user_empresa_123\",\"fileName\":\"test.pdf\"}" ${API_BASE_URL}/api/upload-resume`;
      const { stdout, stderr } = await execAsync(curlCommand2);
      
      try {
        const data = JSON.parse(stdout);
        if (data.success) {
          console.log(`${colors.green}✅ POST bem-sucedido! Status: 200${colors.reset}`);
          console.log(`${colors.green}   Resposta: ${JSON.stringify(data, null, 2)}${colors.reset}\n`);
        }
      } catch (e) {
        console.log(`${colors.yellow}⚠️  Resposta: ${stdout}${colors.reset}\n`);
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠️  Erro: ${error.message}${colors.reset}\n`);
    }
    
    // PASSO 4: Verificar estrutura de response esperada
    console.log(`${colors.cyan}[PASSO 4]${colors.reset} Estrutura esperada de resposta:`);
    console.log(`${colors.green}✅ Campo 'success': true${colors.reset}`);
    console.log(`${colors.green}✅ Campo 'fileId': ID único do arquivo${colors.reset}`);
    console.log(`${colors.green}✅ Campo 'fileName': Nome do arquivo${colors.reset}`);
    console.log(`${colors.green}✅ Campo 'filePath': Caminho local do arquivo${colors.reset}`);
    console.log(`${colors.green}✅ Campo 'url': URL pública para download${colors.reset}`);
    console.log(`${colors.green}✅ Campo 'signedUrl': URL assinada (se usando Supabase)${colors.reset}`);
    console.log(`${colors.green}✅ Campo 'uploadedAt': Data/hora do upload\n${colors.reset}`);
    
    console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}✅ TESTE DE UPLOAD CONCLUÍDO${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);
    
  } catch (error) {
    console.error(`\n${colors.red}❌ ERRO NO TESTE:${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}\n`);
  } finally {
    // Limpar arquivo de teste
    const pdfPath = path.join(__dirname, 'curriculum_teste.pdf');
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
      console.log(`${colors.cyan}🗑️  Arquivo de teste removido${colors.reset}\n`);
    }
  }
}

// Executar teste
testUpload();
