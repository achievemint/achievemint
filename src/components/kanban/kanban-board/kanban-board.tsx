import {Achievement} from "@/entities/Achievement";
import KanbanSection from "@/components/kanban/kanban-section/kanban-section";
import LockIcon from "@mui/icons-material/Lock";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    PointerSensor,
    TouchSensor
} from "@dnd-kit/core";
import {useState} from "react";
import KanbanCard from "@/components/kanban/kanban-card/kanban-card";
import {useInProgress} from "@/hooks/useInProgress";

enum SectionKey {
    LOCKED = "locked", IN_PROGRESS = "inprogress", UNLOCKED = "unlocked"
}

export default function KanbanBoard({achievements, gameId}: {
    achievements: Achievement[],
    gameId: string
}): React.ReactElement {
    const locked: Array<Achievement> = []
    const unlocked: Array<Achievement> = []
    const inProgressAchievements: Array<Achievement> = []

    const {inProgress, removeFromInProgress, addToInProgress} = useInProgress(gameId);
    const [activeAchievementDrag, setActiveAchievementDrag] = useState<Achievement | null>(null);

    achievements.forEach((achievement) => {
        if (inProgress.includes(achievement.name)) {
            inProgressAchievements.push(achievement)
        } else if (achievement.unlocked) {
            unlocked.push(achievement)
        } else {
            locked.push(achievement)
        }
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const dropSection = event.over?.id?.toString();
        const currentEventId = event.active.id.toString();
        if (dropSection) {
            if ((dropSection == SectionKey.UNLOCKED && activeAchievementDrag?.unlocked) || (dropSection == SectionKey.LOCKED && !activeAchievementDrag?.unlocked)) {
                removeFromInProgress(currentEventId);
            } else if (dropSection == SectionKey.IN_PROGRESS) {
                addToInProgress(currentEventId);
            }
        }
    }

    const handleDragStart = (event: DragEndEvent) => {
        setActiveAchievementDrag(achievements.find((item) => item.name === event.active.id.toString()) || null);
    }

    return (
        <div
            className={"flex justify-around max-h-full w-full landscape:max-lg:max-w-full gap-1 lg:gap-20 lg:ml-20 lg:mr-20"}>
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={[
                KeyboardSensor, MouseSensor, PointerSensor, TouchSensor
            ].map(sensor => {
                return {sensor, options: {}}
            })}>
                <KanbanSection id={SectionKey.LOCKED} achievements={locked} title={"Locked Achievements"}
                               icon={<LockIcon/>}/>
                <KanbanSection id={SectionKey.IN_PROGRESS} achievements={inProgressAchievements} title={"In Progress"}
                               icon={<SportsEsportsIcon/>}/>
                <KanbanSection id={SectionKey.UNLOCKED} achievements={unlocked} title={"Unlocked Achievements"}
                               icon={<LockOpenIcon/>}/>
                <DragOverlay>
                    {activeAchievementDrag ? (
                        <KanbanCard achievement={activeAchievementDrag}/>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}