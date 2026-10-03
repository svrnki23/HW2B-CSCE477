const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

async function withServer(callback) {
  const server = createServer().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { await callback(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}

const post = (base, values) => fetch(base + '/api/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values)
});

test('valid format passes both checks', async () => withServer(async base => {
  const res = await post(base, { email: 'student@example.com', password: 'Password123' });
  assert.equal(res.status, 200);
}));

test('server rejects empty email and short password', async () => withServer(async base => {
  const first = await post(base, { email: '', password: 'Password123' });
  const second = await post(base, { email: 'student@example.com', password: 'short' });
  assert.equal(first.status, 400);
  assert.equal(second.status, 400);
}));

test('XSS payload is rejected and not reflected', async () => withServer(async base => {
  const payload = '<img src=x onerror=alert(1)>@test.com';
  const res = await post(base, { email: payload, password: 'Password123' });
  const body = await res.text();
  assert.equal(res.status, 400);
  assert.equal(body.includes(payload), false);
}));

test('SQL-looking string is rejected as email', async () => withServer(async base => {
  const res = await post(base, { email: "' OR 1=1--@test.com", password: 'Password123' });
  assert.equal(res.status, 400);
}));
