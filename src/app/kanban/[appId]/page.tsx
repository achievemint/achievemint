'use client'
import getAchievementData from "@/services/getAchievementData";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import KanbanBoard from "@/components/kanban/kanban-board/kaban-board";
import {Achievement} from "@/entities/Achievement";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function KanbanBoardPage(params: {params: { appId: string}}) {
    const [achievements, setAchievements] = useState<Array<Achievement> | null>(null)
    const router = useRouter();
    const session = useSession()
    useEffect(() => {
        if (session.status === "authenticated") {
            getAchievementData({appId: params.params.appId}, session.data).then((resp) => {
                setAchievements(resp);
            }).catch(() => router.push("/"))
        }
    }, [params, router, session]);

    if (achievements == null) {
        return (
            <div className="w-full h-full flex flex-col">
                <CircularProgress size="10rem" className="m-auto"/>
            </div>
        )
    }

    return <KanbanBoard achievements={achievements} gameId={params.params.appId} />
}
