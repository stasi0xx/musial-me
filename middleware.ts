import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isAuthRoute = createRouteMatcher(['/admin/sign-in(.*)', '/admin/sign-out(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isAuthRoute(req)) {
    const { userId } = await auth.protect()
    console.log('userId:', userId, '| ADMIN_USER_ID:', process.env.ADMIN_USER_ID)
    if (userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
