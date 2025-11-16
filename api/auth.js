import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.status(401).end('Unauthorized');
    return;
  }

  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username !== 'missiona' || password !== 'kadai') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.status(401).end('Unauthorized');
    return;
  }

  // 認証成功 → 静的ファイルをproxy配信
  const filePath = path.join(process.cwd(), req.url === '/' ? '/index.html' : req.url);
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      res.setHeader('Content-Type', getContentType(filePath));
      res.setHeader('Content-Length', stats.size);
      createReadStream(filePath).pipe(res);
    } else {
      res.status(404).end('Not Found');
    }
  } catch (err) {
    res.status(404).end('Not Found');
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };
  return types[ext] || 'application/octet-stream';
}
