import { NextResponse  } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // User rule for client and server
  if (!session) {
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      return new Response( JSON.stringify({ message: 'Not authorized'}), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } else {
      const requestedPage = req.nextUrl.pathname;
      const url = req.nextUrl.clone();
      url.pathname = `/auth/login`;
      url.search = `p=${ requestedPage }`;
      return NextResponse.redirect( url );
    }
  }

  // Admin rule for client
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const validRoles =['admin', 'super-user', 'SEO']

    if (!validRoles.includes(session.user.role)){
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Admin rule for server
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    const validRoles =['admin', 'super-user', 'SEO']

    if (!validRoles.includes(session.user.role)){
      return new Response( JSON.stringify({ message: 'Not authorized'}), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
}
