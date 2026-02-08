'use client'
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import CloseIcon from '@mui/icons-material/Close';
import {Game} from "@/entities/Game";
import getGames from "@/services/getGames";
import Image from "next/image";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuthenticatedSession} from "@/hooks/useAuthenticatedSession";

function GameCard({game}: { game: Game }): React.ReactElement {

    const [isError, setError] = useState(false)

    return (
        <Link href={"/kanban/" + game.appId}>
            <div className={"flex flex-col w-60"}>
                <div className={"relative w-60 h-96 bg-amber-800 rounded-xs"}>
                    {!isError ? <Image fill={true}
                                       title={game.title}
                                       src={game.cover_img_url}
                                       onError={() => setError(true)}
                                       className={"rounded-xs border-none"}
                                       alt={"No cover art found"}/> :
                        <div className={"h-96 flex flex-col items-center m-auto"}><BrokenImageIcon
                            className={"flex grow text-5xl"}/></div>}

                </div>
                <div className={"overflow-auto text-center"}>{game.title}</div>
            </div>
        </Link>
    )
}

export default function GameListPage() {
    const [games, setGames] = useState<Array<Game> | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter();
    const searchParams = useSearchParams();
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const session = useAuthenticatedSession()

    useEffect(() => {
        setIsMounted(true)
        const query = searchParams.get('search') || ''
        setSearchQuery(query)
    }, [searchParams])

    const updateSearchParams = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (searchQuery) {
            params.set('search', searchQuery)
        } else {
            params.delete('search')
        }
        router.push(`?${params.toString()}`, {scroll: false})
    }, [searchQuery, searchParams, router])

    useEffect(() => {
        if (isMounted) {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current)
            }

            debounceTimeout.current = setTimeout(() => {
                updateSearchParams()
            }, 300)

            return () => {
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current)
                }
            }
        }
    }, [searchQuery, isMounted, updateSearchParams])

    useEffect(() => {
        if (session) {
            getGames(session)
                .then(res => setGames(res.games));
        }
    }, [router, session, setGames]);

    if (games == null) {
        return (
            <div className="w-full h-full flex flex-col">
                <CircularProgress size="10rem" className="m-auto"/>
            </div>
        )
    }

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className={"flex flex-col gap-6 w-full"}>
            <div className={"flex justify-center w-full"}>
                <div className={"relative w-full max-w-2xl"}>
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={"w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-hidden text-black"}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className={"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"}
                            aria-label="Clear search"
                        >
                            <CloseIcon/>
                        </button>
                    )}
                </div>
            </div>
            <div className={"flex flex-row flex-wrap gap-10 justify-around w-full"}>
                {filteredGames.map(game => <GameCard key={game.appId} game={game}/>)}
            </div>
        </div>
    )
}