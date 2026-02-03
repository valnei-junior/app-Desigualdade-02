const http = require('http');
const data = JSON.stringify({ email: 'test-cli@local.test', password: '123456', name: 'Teste CLI', role: 'student' });

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    try {
      console.log('BODY:', JSON.parse(body));
    } catch (e) {
      console.log('BODY (raw):', body);
    }
  });
});

req.on('error', (err) => console.error('REQUEST ERROR:', err));
req.write(data);
req.end();
