import { useCallback, useEffect, useRef, useState } from 'react';
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

const POSITION_TIMEOUT_MS = 15000;

function getCurrentPositionWithTimeout(): Promise<Location.LocationObject> {
  return Promise.race([
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
    new Promise<Location.LocationObject>((_, reject) =>
      setTimeout(() => reject(new Error('Timed out waiting for a GPS fix.')), POSITION_TIMEOUT_MS)
    ),
  ]);
}

export function useCurrentLocation(autoRequest = true) {
  const [state, setState] = useState<LocationState>({
    coords: null,
    status: 'idle',
    errorMessage: null,
  });
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted.current) return;
      if (status !== 'granted') {
        setState({ coords: null, status: 'denied', errorMessage: 'Location permission was denied.' });
        return;
      }
      const position = await getCurrentPositionWithTimeout();
      if (!isMounted.current) return;
      setState({
        coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        status: 'granted',
        errorMessage: null,
      });
    } catch (err) {
      if (!isMounted.current) return;
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
