import {Achievement} from "@/entities/Achievement";
import {useDraggable} from "@dnd-kit/core";
import AchievementCard from "@/components/achievement-card/achievement-card";
import classNames from "classnames";

export default function KanbanCard({achievement}: { achievement: Achievement }): React.ReactElement {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({id: achievement.name});

    return <div ref={setNodeRef} {...attributes} {...listeners} data-test={'draggable-card'} className={classNames({
        'opacity-50': transform
    })}>
        <AchievementCard achievement={achievement}/>
    </div>
}