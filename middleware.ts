import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto-js';

export const middleware = async (req: NextRequest) => {
  const data = req.headers.get('Authorization');
  const user = data && JSON.parse(data);
   const { name, password } = user;
   const res = NextResponse.next();
   const encrypted = crypto.AES.encrypt(JSON.stringify({ name, password }), '123').toString();
   res.cookies.set('user', encrypted);
   return res;
};
 
export const config = {
  matcher: '/api/users/',
};