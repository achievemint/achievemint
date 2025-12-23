import {Game} from "@/entities/Game";
import {Session} from "next-auth";

export interface GamesResponse {
    games: Array<Game>;
    gameCount: number;
}

export default async function getGames(session: Session): Promise<GamesResponse> {
    const steamId = session?.user?.steam?.steamid
    const response = await fetch(`/api/games?&steamid=${steamId}`);
    return await response.json();
}
