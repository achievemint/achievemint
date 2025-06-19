import {Game} from "@/entities/Game";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?${searchParams.toString()}&key=${process.env.STEAM_SECRET}&include_appinfo=true`
    const resultFromSteam = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const steamJson: Record<string, unknown> = (await resultFromSteam.json()).response;

    const responseData = {
      gameCount: steamJson.game_count,
        games: (steamJson.games as Array<Record<string, unknown>>|| []).map((game: Record<string, unknown>) => {
            const mappedGame: Game = {
                appId: game.appid?.toString() || '',
                title: game.name?.toString() || '',
                playTime: Number.parseInt(game?.playtime_forever?.toString() || '0'),
                cover_img_url: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/library_600x900_2x.jpg`,
                icon_img_url: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
            }

            return mappedGame;
        })
    };

    return Response.json(responseData, {
        headers: {
            // 900 seconds is 15 minutes
            'Cache-Control': 'public, max-age=900, s-maxage=900'
        }
    });
}