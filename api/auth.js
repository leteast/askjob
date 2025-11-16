export default function handler(req, res) {
  const basicAuth = req.headers.authorization;

  if (!basicAuth || !basicAuth.startsWith('Basic ')) {
    return res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"').status(401).send('Unauthorized');
  }

  const credentials = Buffer.from(basicAuth.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username === 'missiona' && password === 'kadai') {
    // 認証成功 → コンテンツを返す（リダイレクトなし）
    return res.status(200).send('Authenticated - Redirecting to content...');  // または req.url にリダイレクト
  }

  return res.status(401).send('Unauthorized');
}
