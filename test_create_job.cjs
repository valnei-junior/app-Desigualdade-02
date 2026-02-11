const http = require('http');

const payload = JSON.stringify({
  companyId: '1770677675220',
  companyName: 'TechCorp Teste',
  title: 'Dev Frontend Jr',
  area: 'TI',
  type: 'Estágio',
  location: 'São Paulo, SP',
  salary: 'R$ 2.000',
  description: 'Vaga teste para frontend',
  requirements: ['React', 'JavaScript', 'CSS']
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/jobs',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('\n--- Response Body ---');
    try {
      const result = JSON.parse(data);
      console.log('✓ JSON válido!');
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('✗ Erro ao fazer parse JSON:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('✗ Erro de conexão:', e.message);
  process.exit(1);
});

console.log('Enviando payload...');
console.log(JSON.stringify(JSON.parse(payload), null, 2));
console.log('\n---\n');

req.write(payload);
req.end();
