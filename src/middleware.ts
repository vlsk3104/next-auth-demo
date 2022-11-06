
import { withAuth } from 'next-auth/middleware'
import { JWT } from 'next-auth/jwt'
import {
  NextRequest,
  // NextResponse
} from 'next/server'

export interface NextRequestWithAuth extends NextRequest {
  nextauth: { token: JWT | null }
}

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      const pathname = req.nextUrl.pathname

      if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
      ) {
        return true
      }

      if (token) return true

      return false
    },
  },
  pages: {
    signIn: '/api/auth/signin',
  },
})

