// Small demo server: validation only, not a real user login service.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.join(__dirname, 'public');
const allowed = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/script.js', ['script.js', 'application/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']]
]);

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && allowed.has(req.url)) {
      const [file, type] = allowed.get(req.url);
      res.writeHead(200, {
        'Content-Type': type,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'"
      });
      fs.createReadStream(path.join(publicDir, file)).pipe(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/login') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 10_000) req.destroy();
      });
      req.on('end', () => {
        let values;
        try { values = JSON.parse(body); }
        catch { return sendJson(res, 400, { message: 'Invalid request.' }); }
        const { email, password } = values || {};
        if (typeof email !== 'string' || typeof password !== 'string') {
          return sendJson(res, 400, { message: 'Email and password are required.' });
        }
        if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
          return sendJson(res, 400, { message: 'Please enter a valid email address.' });
        }
        if (password.length < 8) {
          return sendJson(res, 400, { message: 'Password must be at least 8 characters.' });
        }
        // No database or real account checks are part of this assignment demo.
        return sendJson(res, 200, { message: 'Validation passed. This demo does not log into a real account.' });
      });
      return;
    }

    sendJson(res, 404, { message: 'Not found.' });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3001);
  createServer().listen(port, '127.0.0.1', () => {
    console.log(`Demo login form: http://localhost:${port}`);
  });
}
module.exports = { createServer };
