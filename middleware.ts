import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export const middleware = (req: NextRequest) => {
   const role = req.headers.get('authorization');
   //const { pathname } = req.nextUrl;
  // if(role === 'as') {
     return NextResponse.next();
    // } else {
    //   return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    // }
};
 
export const config = {
  matcher: '/api/:path*',
};