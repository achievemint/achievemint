'use client'

import {Button, CircularProgress, Paper, Typography} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import {signIn, useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import getGames from "@/services/getGames";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Home() {
    const {status, data} = useSession()
    const [stats, setStats] = useState<{
        gameCount: number,
        totalPlaytime: number
    } | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && data) {
            getGames(data).then(res => {
                const totalMinutes = res.games.reduce((acc, game) => acc + (game.playTime || 0), 0);
                setStats({
                    gameCount: res.gameCount || res.games.length,
                    totalPlaytime: Math.round(totalMinutes / 60)
                });
            });
        }
    }, [status, data]);

    const username = data?.user?.name;
    const avatar = data?.user?.image;

    if (status === 'loading') {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <CircularProgress size="4rem"/>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                <Typography variant="h2" className="font-bold text-center">Achievemint</Typography>
                <Typography variant="h5" className="text-gray-400 text-center max-w-md">
                    Track your Steam achievements and manage your backlog with ease.
                </Typography>
                <Button variant="contained" size="large" onClick={() => signIn("steam")}>
                    Sign in with Steam
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full flex flex-col gap-8">
                <div className="flex flex-col items-center gap-4">
                    {avatar && (
                        <Image 
                            src={avatar} 
                            alt={username || "Avatar"} 
                            width={96}
                            height={96}
                            className="rounded-full border-4 border-primary shadow-lg"
                            priority
                        />
                    )}
                    <Typography variant="h3" className="font-bold">Welcome back, {username}!</Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Paper elevation={3} className="p-6 flex flex-col items-center gap-2 bg-opacity-50 backdrop-blur-sm">
                        <SportsEsportsIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6" className="text-gray-400 uppercase tracking-wider text-sm">Games Owned</Typography>
                        <Typography variant="h4" className="font-bold" id="total-games">
                            {stats ? stats.gameCount : <CircularProgress size="1.5rem" />}
                        </Typography>
                    </Paper>

                    <Paper elevation={3} className="p-6 flex flex-col items-center gap-2 bg-opacity-50 backdrop-blur-sm">
                        <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6" className="text-gray-400 uppercase tracking-wider text-sm">Total Playtime</Typography>
                        <Typography variant="h4" className="font-bold" id="total-playtime">
                        {stats ? `${stats.totalPlaytime} hrs` : <CircularProgress size="1.5rem" />}
                        </Typography>
                    </Paper>
                </div>

                <div className="flex justify-center mt-4">
                    <Link href="/games" passHref>
                        <Button variant="contained" size="large" className="px-12 py-3 text-lg font-semibold">
                            Go to Game List
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}