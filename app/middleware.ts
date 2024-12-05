import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Add CORS headers
  res.headers.set('Access-Control-Allow-Origin', '*'); // Use '*' for open access or set a specific origin for production
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle pre-flight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  return res;
}

// Apply middleware to all API routes
export const config = {
  matcher: ['/*'],
};
