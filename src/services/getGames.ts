import {Game} from "@/entities/Game";
import {Session} from "next-auth";

export default async function getGames(session: Session): Promise<Array<Game>> {
    const steamId = session?.user?.steam?.steamid
    const response = await fetch(`/api/games?&steamid=${steamId}`);
    return (await response.json()).games;
}
