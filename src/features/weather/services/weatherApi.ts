import type { CurrentWeather, ForecastDay, WeatherSnapshot } from '../../../shared/types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
    relative_humidity_2m: number;
    surface_pressure: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

export class WeatherFetchError extends Error {}

export async function fetchCurrentWeather(
  latitude: number,
  longitude: number
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      'temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code,is_day,relative_humidity_2m,surface_pressure',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
    forecast_days: '5',
    timezone: 'auto',
  });

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}?${params.toString()}`);
  } catch (err) {
    throw new WeatherFetchError('Unable to reach the weather service. Check your connection.');
  }

  if (!response.ok) {
    throw new WeatherFetchError(`Weather service returned an error (${response.status}).`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  if (!data.current) {
    throw new WeatherFetchError('Weather data was not found for this location.');
  }

  const current: CurrentWeather = {
    temperatureC: data.current.temperature_2m,
    windSpeedKph: data.current.wind_speed_10m,
    windDirectionDeg: data.current.wind_direction_10m,
    precipitationMm: data.current.precipitation,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    humidity: data.current.relative_humidity_2m ?? null,
    pressureHpa: data.current.surface_pressure ?? null,
    observedAt: data.current.time,
  };

  const forecast: ForecastDay[] = (data.daily?.time ?? []).map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMaxC: data.daily.temperature_2m_max[i],
    tempMinC: data.daily.temperature_2m_min[i],
    precipitationSumMm: data.daily.precipitation_sum[i],
    windSpeedMaxKph: data.daily.wind_speed_10m_max[i],
  }));

  return {
    latitude,
    longitude,
    locationName: null,
    current,
    forecast,
  };
}
