/**
 * @jest-environment node
 */

import {GET as getAchievementData} from './route';

// Mock console.error
console.error = jest.fn();

describe('achievementData API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return achievement data successfully', async () => {
    const mockResponse1 = {
      json: jest.fn().mockResolvedValue({ playerStats: { achievements: [] } })
    };
    const mockResponse2 = {
      json: jest.fn().mockResolvedValue({ game: { availableGameStats: { achievements: [] } } })
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);
    
    const response = await getAchievementData({url: 'http://localhost/api/achievementData?appid=123&steamid=456'} as Request);
    const responseData = await response.json();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, 
      expect.stringContaining('https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001'),
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenNthCalledWith(2, 
      expect.stringContaining('https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/'),
      expect.any(Object)
    );
    
    expect(responseData).toEqual({
      response1: { playerStats: { achievements: [] } },
      response2: { game: { availableGameStats: { achievements: [] } } }
    });
  });

  it('should handle errors and return a 500 response', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const response = await getAchievementData({url: 'http://localhost/api/achievementData?appid=123&steamid=456'} as Request);
    const responseData = await response.json();
    
    expect(console.error).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    expect(response.status).toBe(500);
    expect(responseData).toEqual({ error: 'An error occurred while fetching data' });
  });
});