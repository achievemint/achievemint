'use client'
import React, {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {Game} from "@/entities/Game";
import getGames from "@/services/getGames";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

function GameCard({game}: { game: Game }): React.ReactElement {
    return (
        <Link href={"/kanban/" + game.appId}>
            <div className={"flex flex-col w-60"}>
                <div className={"relative w-60 h-96 bg-amber-800 rounded-sm"}>
                    <Image fill={true}
                           title={game.title}
                           src={game.cover_img_url}
                           className={"rounded-sm border-none"}
                           alt={""}/>
                </div>
                <div className={"overflow-auto text-center"}>{game.title}</div>
            </div>
        </Link>
    )
}

export default function GameListPage() {
    const [games, setGames] = useState<Array<Game> | null>(null)
    const router = useRouter();

    const session = useSession()
    
    useEffect(() => {
        if (session.status == 'authenticated') {
            getGames(session.data)
                .then(setGames);
        }
    }, [router, session, setGames]);

    if (games == null) {
        return (
            <div className="w-full h-full flex flex-col">
                <CircularProgress size="10rem" className="m-auto"/>
            </div>
        )
    }

    return (
        <div className={"flex flex-row flex-wrap gap-10 justify-around"}>
            {games.map(game => <GameCard key={game.appId} game={game}/>)}
        </div>
    )
}