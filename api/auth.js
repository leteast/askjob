export default function handler(req, res) {
  const basicAuth = req.headers.authorization;

  if (!basicAuth || !basicAuth.startsWith('Basic ')) {
    return res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"').status(401).send('Unauthorized');
  }

  const credentials = Buffer.from(basicAuth.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username === 'missiona' && password === 'kadai') {
    // 認証成功 → リダイレクト or プロキシ
    return res.redirect(302, '/h_nakayama.html');  // または全体を保護したい場合、res.send('Authenticated')
  }

  return res.status(401).send('Unauthorized');
}
