const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
    res.end('Unauthorized');
    return;
  }

  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username !== 'missiona' || password !== 'kadai') {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' });
    res.end('Unauthorized');
    return;
  }

  // 認証成功 → 静的ファイルを配信
  let filePath = path.join(process.cwd(), req.url === '/' ? '/index.html' : req.url);
  if (req.url.endsWith('/')) filePath += 'index.html';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const contentType = getContentType(filePath);
    res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stats.size });
    fs.createReadStream(filePath).pipe(res);
  });
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
  };
  return types[ext] || 'application/octet-stream';
}
