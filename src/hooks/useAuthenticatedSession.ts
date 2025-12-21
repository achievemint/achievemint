import {signIn, useSession} from "next-auth/react";
import {Session} from "next-auth";

export function useAuthenticatedSession(): Session | null {
    const {data} = useSession({
        required: true,
        onUnauthenticated: () => signIn("steam").then(),
    });

    return data;
}