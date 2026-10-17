const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || require('./package.json').version;
const STARTED_AT = new Date().toISOString();

app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: VERSION,
    uptimeSeconds: Math.floor(process.uptime()),
    startedAt: STARTED_AT,
    instance: process.env.HOSTNAME || 'local'
  });
});

app.get('/version', (req, res) => {
  res.json({ version: VERSION, commit: process.env.GIT_SHA || 'none' });
});

app.get('/api/menu', (req, res) => {
  res.json(require('./data/menu.json'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[food-site] listening on port ${PORT} version=${VERSION}`);
});

module.exports = app;
