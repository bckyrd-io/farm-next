import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Origin', '*'); // Adjust for your needs, e.g., 'https://next-type-farm.vercel.app'
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  return res;
}

export const config = {
  matcher: ['/api/*'], // Apply middleware to all API routes
};
