'use client'
import React, {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import {Game} from "@/entities/Game";
import getGames from "@/services/getGames";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuthenticatedSession} from "@/hooks/useAuthenticatedSession";

function GameCard({game}: { game: Game }): React.ReactElement {

    const [isError, setError] = useState(false)

    return (
        <Link href={"/kanban/" + game.appId}>
            <div className={"flex flex-col w-60"}>
                <div className={"relative w-60 h-96 bg-amber-800 rounded-sm"}>
                    {!isError ? <Image fill={true}
                                       title={game.title}
                                       src={game.cover_img_url}
                                       onError={() => setError(true)}
                                       className={"rounded-sm border-none"}
                                       alt={"No cover art found"}/> :
                        <div className={"h-96 flex flex-col items-center m-auto"}><BrokenImageIcon
                            className={"flex flex-grow text-5xl"}/></div>}

                </div>
                <div className={"overflow-auto text-center"}>{game.title}</div>
            </div>
        </Link>
    )
}

export default function GameListPage() {
    const [games, setGames] = useState<Array<Game> | null>(null)
    const router = useRouter();

    const session = useAuthenticatedSession()

    useEffect(() => {
        if (session) {
            getGames(session)
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