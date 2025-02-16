import SteamProvider, {STEAM_PROVIDER_ID} from 'next-auth-steam'

import type {AuthOptions, Session} from 'next-auth'
import type {NextRequest} from 'next/server'

export function getAuthOptions(req: NextRequest): AuthOptions {
    return {
        providers: [
            SteamProvider(req, {
                clientSecret: process.env.STEAM_SECRET!,
                callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
            })
        ],
        callbacks: {
            jwt({ token, account, profile }) {
                if (account?.provider === STEAM_PROVIDER_ID) {
                    token.steam = profile
                }
                return token
            },
            session({ session, token }) {
                if ('steam' in token) {
                    session.user.steam = token.steam as Session['user']['steam']
                }
                return session
            }
        }
    }
}