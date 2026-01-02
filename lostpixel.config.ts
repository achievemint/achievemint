import {CustomProjectConfig} from 'lost-pixel';

export const config: CustomProjectConfig = {
    configureBrowser: () => {
        return {}
    },
    pageShots: {
        pages: [
            {
                path: '/', name: 'landing',
                breakpoints: [390, 640, 1024]
            },
            {
                path: '/',
                name: 'mobile landscape',
                viewport: {
                    width: 844,
                    height: 390
                }
            }
        ],
        baseUrl: 'http://172.17.0.1:3471',
    },
    lostPixelProjectId: 'cmjvv197q04bbbfscqrslpyvt',
    apiKey: process.env.LOST_PIXEL_API_KEY,
};