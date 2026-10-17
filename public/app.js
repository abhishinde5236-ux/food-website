async function checkHealth() {
  const dot = document.getElementById('health-dot');
  const text = document.getElementById('health-text');
  try {
    const res = await fetch('/health');
    const data = await res.json();
    dot.className = 'dot ok';
    text.textContent = `healthy · up ${data.uptimeSeconds}s`;
    document.getElementById('version').textContent = `v${data.version}`;
    document.getElementById('instance').textContent = data.instance;
  } catch (e) {
    dot.className = 'dot down';
    text.textContent = 'offline';
  }
}

async function loadMenu() {
  const grid = document.getElementById('menu-grid');
  try {
    const res = await fetch('/api/menu');
    const data = await res.json();
    document.getElementById('env').textContent = data.restaurant;
    grid.innerHTML = data.items.map(item => `
      <div class="card">
        <div class="emoji">${item.emoji}</div>
        <h3>${item.name}</h3>
        <div class="price">$${item.price.toFixed(2)}</div>
        <span class="tag">${item.tag}</span>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p>Failed to load menu.</p>';
  }
}

checkHealth();
loadMenu();
setInterval(checkHealth, 10000);
