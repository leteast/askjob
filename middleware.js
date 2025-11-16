import { NextResponse } from 'next/server';

export function middleware(request) {
  const auth = request.headers.get('authorization');

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
    return NextResponse.next();  // 認証成功 → そのままページ表示
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
  matcher: '/:path*',
};
