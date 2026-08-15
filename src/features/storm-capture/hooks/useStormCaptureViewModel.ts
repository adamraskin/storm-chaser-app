import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentLocation } from '../../../shared/hooks/useCurrentLocation';
import { fetchCurrentWeather } from '../../../features/weather/services/weatherApi';
import { describeWeatherCode } from '../../../shared/utils/weatherCodes';
import { insertStormEntry } from '../../../shared/db/stormRepository';
import type { StormType } from '../../../shared/types/storm';

export interface CaptureFormState {
  temperatureC: number | null;
  windSpeedKph: number | null;
  precipitationMm: number | null;
  weatherSummary: string | null;
  stormType: StormType;
  notes: string;
  weatherLoading: boolean;
  weatherError: string | null;
}

const initialForm: CaptureFormState = {
  temperatureC: null,
  windSpeedKph: null,
  precipitationMm: null,
  weatherSummary: null,
  stormType: 'other',
  notes: '',
  weatherLoading: false,
  weatherError: null,
};

export function useStormCaptureViewModel() {
  const { coords, status: locationStatus, errorMessage: locationError, requestLocation } =
    useCurrentLocation();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [capturedAt, setCapturedAt] = useState<string | null>(null);
  const [form, setForm] = useState<CaptureFormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const capturePhoto = useCallback(
    async (uri: string) => {
      setPhotoUri(uri);
      setCapturedAt(new Date().toISOString());

      if (!coords) {
        setForm((prev) => ({ ...prev, weatherError: 'Location unavailable; enter conditions manually.' }));
        return;
      }

      setForm((prev) => ({ ...prev, weatherLoading: true, weatherError: null }));
      try {
        const snapshot = await fetchCurrentWeather(coords.latitude, coords.longitude);
        if (!isMounted.current) return;
        setForm((prev) => ({
          ...prev,
          temperatureC: snapshot.current.temperatureC,
          windSpeedKph: snapshot.current.windSpeedKph,
          precipitationMm: snapshot.current.precipitationMm,
          weatherSummary: describeWeatherCode(snapshot.current.weatherCode),
          weatherLoading: false,
        }));
      } catch (err) {
        if (!isMounted.current) return;
        setForm((prev) => ({
          ...prev,
          weatherLoading: false,
          weatherError: 'Could not auto-fill weather conditions. Enter them manually.',
        }));
      }
    },
    [coords]
  );

  const retake = useCallback(() => {
    setPhotoUri(null);
    setCapturedAt(null);
    setForm(initialForm);
  }, []);

  const updateForm = useCallback(<K extends keyof CaptureFormState>(key: K, value: CaptureFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    if (!photoUri || !coords || !capturedAt) return null;
    setSaving(true);
    try {
      const entry = await insertStormEntry({
        photoUri,
        latitude: coords.latitude,
        longitude: coords.longitude,
        capturedAt,
        temperatureC: form.temperatureC,
        windSpeedKph: form.windSpeedKph,
        precipitationMm: form.precipitationMm,
        weatherSummary: form.weatherSummary,
        stormType: form.stormType,
        notes: form.notes,
      });
      retake();
      return entry;
    } finally {
      setSaving(false);
    }
  }, [photoUri, coords, capturedAt, form, retake]);

  return {
    coords,
    locationStatus,
    locationError,
    requestLocation,
    photoUri,
    capturedAt,
    form,
    updateForm,
    capturePhoto,
    retake,
    save,
    saving,
    canSave: Boolean(photoUri && coords && capturedAt),
  };
}
