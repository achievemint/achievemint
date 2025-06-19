import {Achievement} from "@/entities/Achievement";
import {Session} from "next-auth";

export default async function getAchievementData(args: {appId: string}, session: Session): Promise<Array<Achievement>> {
    const steamId = session?.user?.steam?.steamid

    const params = new URLSearchParams({
        appid: args.appId,
        steamid: steamId || '',
        l: 'en_us'
    });

    const resp = await (await fetch(`/api/achievementData?${params.toString()}`)).json();

    return resp.achievements;
}
