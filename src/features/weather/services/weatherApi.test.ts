import { fetchCurrentWeather, WeatherFetchError } from './weatherApi';

function mockFetchOnce(response: Partial<Response> & { ok: boolean; status?: number; json?: () => any }) {
  global.fetch = jest.fn().mockResolvedValue(response) as any;
}

describe('fetchCurrentWeather', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('parses a successful response into a WeatherSnapshot', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({
        current: {
          time: '2026-08-14T12:00',
          temperature_2m: 21.4,
          wind_speed_10m: 32.1,
          wind_direction_10m: 180,
          precipitation: 0.2,
          weather_code: 95,
          is_day: 1,
          relative_humidity_2m: 60,
          surface_pressure: 1008,
        },
        daily: {
          time: ['2026-08-14'],
          weather_code: [95],
          temperature_2m_max: [26],
          temperature_2m_min: [18],
          precipitation_sum: [4.2],
          wind_speed_10m_max: [40],
        },
      }),
    });

    const snapshot = await fetchCurrentWeather(35.4, -97.5);

    expect(snapshot.current.temperatureC).toBe(21.4);
    expect(snapshot.current.weatherCode).toBe(95);
    expect(snapshot.forecast).toHaveLength(1);
    expect(snapshot.forecast[0].tempMaxC).toBe(26);
  });

  it('throws WeatherFetchError when the response is not ok', async () => {
    mockFetchOnce({ ok: false, status: 500, json: async () => ({}) });
    await expect(fetchCurrentWeather(0, 0)).rejects.toBeInstanceOf(WeatherFetchError);
  });

  it('throws WeatherFetchError when the network request fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as any;
    await expect(fetchCurrentWeather(0, 0)).rejects.toBeInstanceOf(WeatherFetchError);
  });

  it('throws WeatherFetchError when current data is missing', async () => {
    mockFetchOnce({ ok: true, json: async () => ({}) });
    await expect(fetchCurrentWeather(0, 0)).rejects.toBeInstanceOf(WeatherFetchError);
  });
});
