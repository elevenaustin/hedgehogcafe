import express from 'express';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Serve static assets from Vite build directory
app.use(express.static(distPath));

// Handle Single Page Application (SPA) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n====================================================');
  console.log('  🦔 The Hedgehog Café is running on Localhost!');
  console.log('====================================================\n');
  console.log(`  🌐 Website:     ${url}`);
  console.log(`  🔐 Admin Panel: ${url}/admin55555`);
  console.log(`  ⚙️  Network:     http://0.0.0.0:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server.\n');

  // Auto-open browser if OPEN_BROWSER env is set or when run via batch script
  if (process.env.OPEN_BROWSER === 'true') {
    const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${startCmd} ${url}`);
  }
});
