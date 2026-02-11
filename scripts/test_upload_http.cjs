#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:4000/api/upload-resume';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}   🧪 TESTE DE UPLOAD - REQUISIÇÃO HTTP SIMPLES${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

function httpRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && method === 'POST') {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: body } });
        }
      });
    });

    req.on('error', reject);

    if (data && method === 'POST') {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  try {
    console.log(`${colors.cyan}[TESTE 1]${colors.reset} Testando health check...\n`);
    
    const health = await httpRequest('GET', '/api/health');
    if (health.status === 200) {
      console.log(`${colors.green}✅ Backend respondendo!${colors.reset}`);
      console.log(`   Status: ${health.status}`);
      console.log(`   Response: ${JSON.stringify(health.data)}\n`);
    }

    console.log(`${colors.cyan}[TESTE 2]${colors.reset} Testando POST simples para /api/upload-resume...\n`);
    
    const uploadResponse = await httpRequest('POST', '/api/upload-resume', {
      userId: 'user_test_123',
      fileName: 'curriculum_teste.pdf'
    });

    if (uploadResponse.status === 200 && uploadResponse.data.success) {
      console.log(`${colors.green}✅ Upload endpoint respondendo!${colors.reset}`);
      console.log(`   Status: ${uploadResponse.status}`);
      console.log(`${colors.green}   Resposta:${colors.reset}`);
      Object.keys(uploadResponse.data).forEach(key => {
        console.log(`${colors.green}   - ${key}: ${uploadResponse.data[key]}${colors.reset}`);
      });
      console.log();
    } else {
      console.log(`${colors.yellow}⚠️  Status: ${uploadResponse.status}${colors.reset}`);
      console.log(`   Response: ${JSON.stringify(uploadResponse.data)}\n`);
    }

    console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}✅ TESTES CONCLUÍDOS${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}\n`);

  } catch (error) {
    console.log(`${colors.red}❌ ERRO:${colors.reset}`);
    console.log(`${colors.red}   ${error.message}${colors.reset}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`${colors.yellow}💡 Dica: Backend não está rodando em http://localhost:4000${colors.reset}`);
      console.log(`${colors.yellow}   Execute em outro terminal:${colors.reset}`);
      console.log(`${colors.yellow}   cd backend && npm start${colors.reset}\n`);
    }
  }
}

runTests();
