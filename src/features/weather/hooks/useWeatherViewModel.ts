import { useCallback, useEffect, useState } from 'react';
import { useCurrentLocation } from '../../../shared/hooks/useCurrentLocation';
import { fetchCurrentWeather, WeatherFetchError } from '../services/weatherApi';
import type { WeatherSnapshot } from '../../../shared/types/weather';

interface WeatherViewState {
  snapshot: WeatherSnapshot | null;
  loading: boolean;
  refreshing: boolean;
  notFound: boolean;
  errorMessage: string | null;
}

export function useWeatherViewModel() {
  const { coords, status: locationStatus, errorMessage: locationError, requestLocation } =
    useCurrentLocation();

  const [state, setState] = useState<WeatherViewState>({
    snapshot: null,
    loading: false,
    refreshing: false,
    notFound: false,
    errorMessage: null,
  });

  const loadWeather = useCallback(async (latitude: number, longitude: number, isRefresh = false) => {
    setState((prev) => ({
      ...prev,
      loading: !isRefresh,
      refreshing: isRefresh,
      errorMessage: null,
    }));
    try {
      const snapshot = await fetchCurrentWeather(latitude, longitude);
      setState({ snapshot, loading: false, refreshing: false, notFound: false, errorMessage: null });
    } catch (err) {
      const message = err instanceof WeatherFetchError ? err.message : 'Something went wrong fetching weather data.';
      setState({ snapshot: null, loading: false, refreshing: false, notFound: true, errorMessage: message });
    }
  }, []);

  useEffect(() => {
    if (coords) {
      loadWeather(coords.latitude, coords.longitude);
    }
  }, [coords, loadWeather]);

  const refresh = useCallback(() => {
    if (coords) {
      loadWeather(coords.latitude, coords.longitude, true);
    } else {
      requestLocation();
    }
  }, [coords, loadWeather, requestLocation]);

  const retry = useCallback(() => {
    requestLocation()
  }, [requestLocation]);

  return {
    coords,
    locationStatus,
    locationError,
    ...state,
    refresh,
    retry,
  };
}
