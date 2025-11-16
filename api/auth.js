import { NextResponse } from 'next/server';

export default function handler(req) {
  const auth = req.headers.get('authorization');

  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username === 'missiona' && password === 'kadai') {
    // 認証成功 → 静的ファイルを返す
    return NextResponse.redirect(new URL('/h_nakayama.html', req.url));
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// 全体に適用
export const config = {
  api: {
    bodyParser: false,
  },
};
