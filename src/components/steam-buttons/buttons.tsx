'use client'

import {signIn, signOut} from 'next-auth/react'

export function SignIn() {
    return <button onClick={() => signIn("steam")}>Sign In</button>
}

export function SignOut() {
    return <button onClick={() => signOut({callbackUrl: '/'})}>Sign Out</button>
}