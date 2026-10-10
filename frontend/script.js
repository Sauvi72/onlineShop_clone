const API_BASE_URL = window.API_BASE_URL || (typeof process !== 'undefined' && process.env?.API_URL) || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  checkBackendStatus();
  fetchItems();

  const form = document.getElementById('create-item-form');
  form.addEventListener('submit', handleCreateItem);

  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.addEventListener('click', () => {
    checkBackendStatus();
    fetchItems();
  });
});

async function checkBackendStatus() {
  const statusPill = document.getElementById('api-status');
  const statusText = document.getElementById('status-text');
  const dbModeEl = document.getElementById('db-mode');

  try {
    const res = await fetch(`${API_BASE_URL}/`);
    if (!res.ok) throw new Error('Backend returned non-200');
    
    const data = await res.json();
    statusPill.className = 'api-status-pill online';
    statusText.textContent = 'Backend Online (Port 5000)';
    dbModeEl.textContent = data.database ? data.database.split(' ')[0] : 'Online';
  } catch (err) {
    statusPill.className = 'api-status-pill offline';
    statusText.textContent = 'Backend Offline';
    dbModeEl.textContent = 'Offline';
  }
}

async function fetchItems() {
  const container = document.getElementById('items-container');
  const totalCountEl = document.getElementById('total-count');

  try {
    const res = await fetch(`${API_BASE_URL}/api/data`);
    const result = await res.json();

    if (!result.success) throw new Error(result.message);

    const items = result.data;
    totalCountEl.textContent = items.length;

    if (items.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">No items found. Create your first item above!</p>`;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="item-card">
        <div>
          <div class="item-header">
            <h3 class="item-title">${escapeHtml(item.title)}</h3>
            <span class="badge badge-${(item.status || 'Active').toLowerCase()}">${escapeHtml(item.status || 'Active')}</span>
          </div>
          <p class="item-description">${escapeHtml(item.description || 'No description provided.')}</p>
        </div>
        <div class="item-footer">
          <span>📁 ${escapeHtml(item.category || 'General')}</span>
          <button class="btn-delete" onclick="deleteItem(${item.id})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching items:', err);
    container.innerHTML = `<p style="color: var(--danger); grid-column: 1/-1;">Failed to connect to backend server. Make sure <code>app.js</code> is running.</p>`;
  }
}

async function handleCreateItem(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const status = document.getElementById('status').value;
  const description = document.getElementById('description').value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, status, description })
    });

    const result = await res.json();
    if (result.success) {
      document.getElementById('create-item-form').reset();
      fetchItems();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (err) {
    alert('Failed to connect to backend server.');
  }
}

async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/data/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();
    if (result.success) {
      fetchItems();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (err) {
    alert('Failed to delete item.');
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
