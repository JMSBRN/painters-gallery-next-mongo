import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = (req: NextRequest) => {
  const localSecret = process.env.CALL_SECRET;   
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
};
 
export const config = {
  matcher: ['/api/users/:path*', '/api/images/:path*', '/api/uploads'],
};