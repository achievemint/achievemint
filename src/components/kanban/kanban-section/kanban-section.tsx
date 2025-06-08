import {Achievement} from "@/entities/Achievement";
import {Avatar} from "@mui/material";
import {ReactElement} from "react";
import KanbanCard from "@/components/kanban/kanban-card/kanban-card";
import {useDroppable} from "@dnd-kit/core";

interface KanbanSectionProps extends React.RefAttributes<HTMLDivElement> {
    achievements: Array<Achievement>;
    title: string;
    icon: ReactElement;
    id: string;
}

export default function KanbanSection({achievements, title, icon, id}: KanbanSectionProps): React.ReactElement {
    const {setNodeRef, active, isOver} = useDroppable({id});
    const dragOverStyle = (active?.id !== id && isOver) ? "bg-green-800" : "";
    return (
        <div ref={setNodeRef} className={"flex flex-col rounded-md grow basis-0 border-blue-400 border-8 p-3"} data-test={"kanban-section"}>
            <div className={"flex items-center"} data-test={"kanban-header"}>
                {icon}
                <h1 className="text-3xl font-bold flex grow">{title}</h1>
                <Avatar className={"flex self-end"} data-test={"section-count"}>{achievements.length}</Avatar>
            </div>

            <div className={"flex grow flex-col gap-3 overflow-y-auto" + ` ${dragOverStyle}`} style={{scrollbarWidth: "thin", scrollbarColor: "#000000 gray"}}>
                {achievements?.map((item, index) => <KanbanCard achievement={item} key={index}/> )}
            </div>
        </div>
    )
}