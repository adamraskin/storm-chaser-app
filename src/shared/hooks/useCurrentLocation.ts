import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationState {
  coords: Coordinates | null;
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'error';
  errorMessage: string | null;
}

export function useCurrentLocation(autoRequest = true) {
  const [state, setState] = useState<LocationState>({
    coords: null,
    status: 'idle',
    errorMessage: null,
  });

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ coords: null, status: 'denied', errorMessage: 'Location permission was denied.' });
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setState({
        coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        status: 'granted',
        errorMessage: null,
      });
    } catch (err) {
      setState({
        coords: null,
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Unable to determine location.',
      });
    }
  }, []);

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return { ...state, requestLocation };
}
