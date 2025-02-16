'use client'

import {Button, CircularProgress,} from "@mui/material";
import Link from "next/link";
import {SessionContextValue, signIn, useSession} from "next-auth/react";
import React, {ReactElement} from "react";

export default function Home() {
    const {status, data} = useSession()

    const contentStates: Record<SessionContextValue['status'], ReactElement> = {
        'authenticated': <Link href={"/games"}><Button variant={"contained"} color={"primary"}>View game
            list</Button></Link>,
        'unauthenticated': <Button variant={"contained"} onClick={() => signIn("steam")}>Sign in</Button>,
        'loading': <CircularProgress size="2rem" className="m-auto"/>
    }

    const username = data?.user?.name;

    return (
        <div className="w-full h-full flex flex-col items-center justify-around">
            <div className={"flex flex-col gap-4 items-center"}>
                <h1 className={"text-4xl font-bold"}>Welcome to Achievemint!</h1>
                {username && <h2 className={"text-2xl"}>Hello, {username}!</h2>}
                {contentStates[status]}
            </div>
        </div>
    )
}