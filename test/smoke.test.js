const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE = `http://localhost:${PORT}`;

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE + path, res => {
      let body = '';
      res.on('data', c => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function run() {
  const health = await get('/health');
  if (health.status !== 200) throw new Error(`health returned ${health.status}`);
  const parsed = JSON.parse(health.body);
  if (parsed.status !== 'healthy') throw new Error('health status not healthy');

  const menu = await get('/api/menu');
  if (menu.status !== 200) throw new Error(`menu returned ${menu.status}`);
  if (JSON.parse(menu.body).items.length === 0) throw new Error('menu empty');

  const version = await get('/version');
  if (version.status !== 200) throw new Error(`version returned ${version.status}`);

  console.log('All smoke tests passed ✅');
}

run().catch(err => {
  console.error('Smoke test failed ❌', err.message);
  process.exit(1);
});
