export interface CurrentWeather {
  temperatureC: number;
  windSpeedKph: number;
  windDirectionDeg: number;
  precipitationMm: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number | null;
  pressureHpa: number | null;
  observedAt: string;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  tempMaxC: number;
  tempMinC: number;
  precipitationSumMm: number;
  windSpeedMaxKph: number;
}

export interface WeatherSnapshot {
  latitude: number;
  longitude: number;
  locationName: string | null;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
