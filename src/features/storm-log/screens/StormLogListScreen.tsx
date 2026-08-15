import React, { useState } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Skeleton } from '../../../shared/components/Skeleton';
import { Card } from '../../../shared/components/Card';
import { spacing, radii, useThemeColors } from '../../../shared/theme';
import { useStormLogViewModel } from '../hooks/useStormLogViewModel';
import { StormEntryCard } from '../components/StormEntryCard';
import type { StormLogStackParamList } from '../../../shared/navigation/types';

type Props = NativeStackScreenProps<StormLogStackParamList, 'StormLogList'>;

let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
}

export function StormLogListScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const { entries, loading, refreshing, refresh } = useStormLogViewModel();
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: colors.text }]}>Storm Log</Text>
        <View style={[styles.toggle, { borderColor: colors.border }]}>
          {(['list', 'map'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setView(mode)}
              style={[styles.toggleBtn, view === mode && { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: view === mode ? '#FFFFFF' : colors.text, fontWeight: '600' }}>
                {mode === 'list' ? 'List' : 'Map'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={{ gap: spacing.sm }}>
          <Skeleton width="100%" height={80} borderRadius={radii.lg} />
          <Skeleton width="100%" height={80} borderRadius={radii.lg} />
          <Skeleton width="100%" height={80} borderRadius={radii.lg} />
        </View>
      ) : entries.length === 0 ? (
        <EmptyState title="No storms logged yet" message="Capture your first storm from the Capture tab." />
      ) : view === 'list' ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
          renderItem={({ item }) => (
            <StormEntryCard entry={item} onPress={() => navigation.navigate('StormLogDetail', { entryId: item.id })} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
        />
      ) : MapView ? (
        <Card style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: entries[0].latitude,
              longitude: entries[0].longitude,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            {entries.map((entry) => (
              <Marker
                key={entry.id}
                coordinate={{ latitude: entry.latitude, longitude: entry.longitude }}
                title={entry.stormType}
                description={new Date(entry.capturedAt).toLocaleString()}
                onCalloutPress={() => navigation.navigate('StormLogDetail', { entryId: entry.id })}
              />
            ))}
          </MapView>
        </Card>
      ) : (
        <EmptyState title="Map unavailable" message="Map view isn't supported on this platform." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  header: { fontSize: 22, fontWeight: '700' },
  toggle: { flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth, borderRadius: radii.pill, overflow: 'hidden' },
  toggleBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
});
