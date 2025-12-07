const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

const rootIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="0; url=./host/index.html" />
  <title>Module Federation Demo - Redirecting...</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #f9fafb;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #1f2937;
      margin-bottom: 1rem;
    }
    p {
      color: #6b7280;
    }
    .spinner {
      border: 3px solid #e5e7eb;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  <script>
    window.location.href = './host/index.html';
  </script>
</head>
<body>
  <div class="container">
    <h1>Module Federation Demo</h1>
    <div class="spinner"></div>
    <p>Redirecting to Host App...</p>
    <p><a href="./host/index.html">Click here if not redirected automatically</a></p>
  </div>
</body>
</html>
`;

try {
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory does not exist. Run build first.');
    process.exit(1);
  }

  fs.writeFileSync(path.join(distDir, 'index.html'), rootIndexHtml);
  
  const nojekyll = path.join(distDir, '.nojekyll');
  fs.writeFileSync(nojekyll, '');

  console.log('GitHub Pages structure organized successfully!');
  console.log('');
  console.log('Structure:');
  console.log('  dist/');
  console.log('    ├── index.html (redirect to host)');
  console.log('    ├── .nojekyll (disable Jekyll processing)');
  console.log('    ├── host/');
  console.log('    ├── remote-a/');
  console.log('    ├── remote-b/');
  console.log('    └── lk-common-lib/');
  console.log('');
  console.log('Ready to deploy with: pnpm run gitdeploy');
} catch (error) {
  console.error('Error organizing GitHub Pages:', error);
  process.exit(1);
}

