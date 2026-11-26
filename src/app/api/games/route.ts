import {Game} from "@/entities/Game";
import {getSteamCoverUrls} from "@/app/api/games/getSteamCoverUrls";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?${searchParams.toString()}&key=${process.env.STEAM_SECRET}&include_appinfo=true&include_extended_appinfo=true`
    const resultFromSteam = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const steamJson: Record<string, unknown> = (await resultFromSteam.json()).response;

    const gameCollection = steamJson.games as Array<Record<string, unknown>> || [];
    const coverUrls = await getSteamCoverUrls(gameCollection.map(game => game.appid?.toString() || '').filter(appId => !!appId))

    const responseData = {
        gameCount: steamJson.game_count,
        games: gameCollection.map((game: Record<string, unknown>) => {
            const mappedGame: Game = {
                appId: game.appid?.toString() || '',
                title: game.name?.toString() || '',
                playTime: Number.parseInt(game?.playtime_forever?.toString() || '0'),
                cover_img_url: coverUrls[game.appid?.toString() || ''] || `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/${game.capsule_filename}`,
                icon_img_url: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
                last_played: Number.parseInt(game?.rtime_last_played?.toString() || '0')
            }

            return mappedGame;
        }).sort((a, b) => b.last_played - a.last_played)
    };

    return Response.json(responseData, {
        headers: {
            // 900 seconds is 15 minutes
            'Cache-Control': 'public, max-age=900, s-maxage=900'
        }
    });
}