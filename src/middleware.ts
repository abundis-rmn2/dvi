import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block access to deprecated individual hashtag subroutes (e.g. /hashtags/some_id)
  if (pathname.startsWith('/hashtags/') && pathname.length > '/hashtags/'.length) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hashtags/:path+'],
};
