import React from 'react';
import {Achievement} from "@/entities/Achievement";
import Image from "next/image";
import classNames from "classnames";

interface AchievementCardProps {
    achievement: Achievement;
}

function UnlockDate(args: { date: number, unlocked: boolean }) {
    if (args.unlocked) {
        // date is in UTC epoch seconds
        const localDateTime: Date = new Date(0);
        localDateTime.setUTCSeconds(args.date);

        const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(localDateTime);
        return <p className={"text-xs"}>{formattedDate}</p>
    }
}

export default function AchievementCard({
                                            achievement: {
                                                unlocked,
                                                icon,
                                                iconGray,
                                                name,
                                                description,
                                                unlockDate
                                            }
                                        }: AchievementCardProps): React.ReactElement {
    const backgroundColor = unlocked ? 'bg-green-500' : 'bg-gray-500';

    return (
        <div
            className={classNames("border-4 select-none flex flex-col rounded-md border-blue-400 p-1", backgroundColor)}
            data-test={"achievement-card"}>
            <div className={"flex flex-row"}>
                <div className={"relative w-12 h-12 aspect-square"}>
                    <Image fill={true}
                           src={unlocked ? icon : iconGray}
                           alt={"achievement icon"}/>
                </div>
                <div className={"flex-col lg:pb-2 pl-1 grow"}>
                    <h3 className="font-bold lg:text-lg sm:text-xs">{name}</h3>
                    <p className="text-xs">{description}</p>
                </div>
                <div className={classNames("flex-col pl-2 text-center", {
                    "hidden": !unlocked
                })}>
                    <UnlockDate date={unlockDate}
                                unlocked={unlocked}/>
                </div>
            </div>
        </div>
    );
}