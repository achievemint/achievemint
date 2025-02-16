import {Achievement} from "@/entities/Achievement";
import {Session} from "next-auth";

export default async function getAchievementData(args: {appId: string}, session: Session): Promise<Array<Achievement>> {
    const steamId = session?.user?.steam?.steamid
    const resp = await (await fetch(`/api/achievementData?appid=${args.appId}&steamid=${steamId}&l=en_us`)).json()

    return (resp.response1.playerstats.achievements || []).map((entry: {
        apiname: string,
        name: string,
        description: string,
        achieved: number,
        unlocktime: number,
    } ) => {
        const gameSchema = resp.response2.game.availableGameStats.achievements.find((schema: {
            name: string,
            defaultvalue: number,
            displayName: string,
            hidden: number,
            icon: string,
            icongray: string,
        }) => {
            if (schema.name === entry.apiname) {
                return true;
            }
        });
        const achievement: Achievement = {
            name: entry.name,
            description: entry.description,
            unlocked: !!(entry.achieved),
            unlockDate: entry.unlocktime,
            icon: gameSchema.icon,
            iconGray: gameSchema.icongray
        }
        return achievement;
    });
}