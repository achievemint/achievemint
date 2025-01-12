'use client'
import getAchievementData from "@/services/getAchievementData";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import KanbanBoard from "@/components/kanban/kanban-board/kaban-board";
import {Achievement} from "@/entities/Achievement";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function KanbanBoardPage(params: {params: Promise<{ appId: string}>}) {
    const [achievements, setAchievements] = useState<Array<Achievement> | null>(null)
    const [appId, setAppId] = useState<string | null>(null)
    const router = useRouter();
    const session = useSession()
    useEffect(() => {
        params.params.then((resp) => {
            setAppId(resp.appId)
            if (session.status === "authenticated") {
                getAchievementData({appId: resp.appId}, session.data).then((resp) => {
                    setAchievements(resp);
                }).catch(() => router.push("/"))
            }
        })
    }, [params, router, session, setAppId]);

    if (!!achievements && !!appId) {
        return <KanbanBoard achievements={achievements} gameId={appId} />
    }

    return (
        <div className="w-full h-full flex flex-col">
            <CircularProgress size="10rem" className="m-auto"/>
        </div>
    )
}
