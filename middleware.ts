import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const localSecret = process.env.CALL_SECRET;   
  if (pathname === '/api/users') {
    const data = req.headers.get('Authorization');
    const parsedData = data && JSON.parse(data);
    if (parsedData) {
      const { secret } = parsedData;
      if(localSecret === secret){
        return NextResponse.next();
      } else {
        return NextResponse.rewrite(new URL('/unauthorized', req.url));
      }
     } else {
       return NextResponse.rewrite(new URL('/unauthorized', req.url));
     } 
    } else {
     return NextResponse.next();
   }
};
 
export const config = {
  matcher: '/api/:path*',
};