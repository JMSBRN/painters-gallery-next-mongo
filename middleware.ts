import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto, {  } from 'crypto-js';
 
export const middleware = (req: NextRequest) => {

  //  const response = new NextResponse();
  //  const obj = { name: 'name', email: 'email' };
  //  const encrypted = crypto.AES.encrypt(JSON.stringify(obj), '123').toString();
  //  response.cookies.set('cookieName', encrypted, {
  //    maxAge: 60 * 60 * 24 * 7,
  //    httpOnly: true,
  //    secure: true,
  //    path: '/',
  //  });
   return NextResponse.next();
};
 
export const config = {
  matcher: '/api/:path*',
};