import {Achievement} from "@/entities/Achievement";

async function getJson(url: string) {
    const result = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    return await result.json();
}

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);

    const playerProgressUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001`;
    const gameDataUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/`;

    try {
        const [playerProgress, gameData] = await Promise.all([playerProgressUrl, gameDataUrl]
            .map(url => `${url}?${searchParams.toString()}&key=${process.env.STEAM_SECRET}`)
            .map(getJson));


        const achievementMap: Record<string, Achievement> = {};

        playerProgress?.playerstats?.achievements?.forEach((entry: {
            apiname: string,
            name: string,
            description: string,
            achieved: number,
            unlocktime: number,
        }) => {
            achievementMap[entry.apiname] = {
                name: entry.name,
                description: entry.description,
                unlocked: !!(entry.achieved),
                unlockDate: entry.unlocktime,
                iconGray: '',
                icon: '',
            };
        });

        gameData?.game?.availableGameStats?.achievements?.forEach((schema: {
            name: string,
            defaultvalue: number,
            displayName: string,
            hidden: number,
            icon: string,
            icongray: string,
        }) => {
            const achievement = achievementMap[schema.name];

            if (achievement) {
                achievementMap[schema.name] = {
                    ...achievement,
                    icon: schema.icon,
                    iconGray: schema.icongray
                }
            }
        });


        return Response.json({
            achievements: Object.values(achievementMap)
        }, {
            headers: {
                // 900 seconds is 15 minutes
                'Cache-Control': 'public, max-age=900, s-maxage=900'
            }
        })

    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json({error: 'An error occurred while fetching data'}, {
            status: 500,
            headers: {
                'Cache-Control': 'public, max-age=900, s-maxage=900'
            }
        });
    }
}
