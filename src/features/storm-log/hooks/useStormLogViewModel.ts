import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { deleteStormEntry, getAllStormEntries } from '../../../shared/db/stormRepository';
import type { StormEntry } from '../../../shared/types/storm';

export function useStormLogViewModel() {
  const [entries, setEntries] = useState<StormEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true);

    try {
      const rows = await getAllStormEntries();
      setEntries(rows);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const removeEntry = useCallback(async (id: string) => {
    await deleteStormEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loading, refreshing, refresh: () => load(true), removeEntry };
}
