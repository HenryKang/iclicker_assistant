const SERVER_URL = 'http://localhost:3000';

// Load saved settings
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.sync.get(['provider', 'autoAnswer']);
  
  if (settings.provider) {
    document.getElementById('provider').value = settings.provider;
  }
  if (settings.autoAnswer !== undefined) {
    document.getElementById('autoAnswer').checked = settings.autoAnswer;
  }
});

// Test server connection
document.getElementById('testConnection').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Testing connection...';
  statusEl.className = 'status info';
  
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      statusEl.textContent = '\u2705 Server is running!';
      statusEl.className = 'status success';
    }
  } catch (error) {
    statusEl.textContent = '\u274C Server not running. Start it first!';
    statusEl.className = 'status error';
  }
});

// Save settings
document.getElementById('save').addEventListener('click', async () => {
  const provider = document.getElementById('provider').value;
  const autoAnswer = document.getElementById('autoAnswer').checked;

  await chrome.storage.sync.set({
    provider: provider,
    autoAnswer: autoAnswer
  });

  const statusEl = document.getElementById('status');
  statusEl.textContent = '\u2705 Settings saved successfully!';
  statusEl.className = 'status success';

  setTimeout(() => {
    statusEl.textContent = 'Make sure server is running on localhost:3000';
    statusEl.className = 'status info';
  }, 2000);
});