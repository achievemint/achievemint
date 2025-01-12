import NextAuth from 'next-auth/next'

import type {NextRequest} from 'next/server'
import {getAuthOptions} from "@/app/auth";

async function handler(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
    return NextAuth(req, ctx, getAuthOptions(req))
}

export {
    handler as GET,
    handler as POST
}