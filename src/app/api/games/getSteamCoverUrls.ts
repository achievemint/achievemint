export async function getSteamCoverUrls(
    appIds: string[]
): Promise<Record<string, string>> {
    if (!appIds.length) return {};

    const params = {
        ids: appIds.map((appid) => ({appid: Number(appid)})),
        context: {
            language: "english",
            country_code: "US",
            steam_realm: 1,
        },
        data_request: {
            include_assets: true,
        },
    };

    const url = new URL(
        "https://api.steampowered.com/IStoreBrowseService/GetItems/v1/"
    );

    url.searchParams.set("input_json", JSON.stringify(params));

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();

    const result: Record<string, string> = {};

    for (const item of data.response?.store_items ?? []) {
        const assets = item.assets;

        if (!assets?.library_capsule_2x || !assets?.asset_url_format) {
            continue;
        }

        const coverUrl = `https://shared.steamstatic.com/store_item_assets/${assets.asset_url_format.replace(
            "${FILENAME}",
            assets.library_capsule_2x
        )}`;

        result[String(item.appid)] = coverUrl;
    }

    return result;
}