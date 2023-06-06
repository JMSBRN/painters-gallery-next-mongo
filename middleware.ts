import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto-js';

export const middleware = (req: NextRequest) => {
   const res = NextResponse.next();
  //  const { pathname } = req.nextUrl;
  //  if(pathname === '/api/auth') {
       
  //  } else if (pathname === '/api/users') {
  //    const data = req.headers.get('Authorization');
  //    const user = data && JSON.parse(data);
  //    if (user) {
  //      const { name, password } = user;
  //      const encrypted = crypto.AES.encrypt(JSON.stringify({ name, password }), '123').toString();
  //      res.cookies.set('user', encrypted);
  //      return res;
  //    }
  //  }
  return res;

};
 
export const config = {
  matcher: '/api/:path*',
};