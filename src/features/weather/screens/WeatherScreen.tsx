import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { Card } from '../../../shared/components/Card';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Skeleton } from '../../../shared/components/Skeleton';
import { spacing, useThemeColors } from '../../../shared/theme';
import { describeWeatherCode, isSevereWeatherCode } from '../../../shared/utils/weatherCodes';
import { useWeatherViewModel } from '../hooks/useWeatherViewModel';
import { WeatherStat } from '../components/WeatherStat';

export function WeatherScreen() {
  const colors = useThemeColors();
  const { snapshot, loading, refreshing, notFound, errorMessage, locationStatus, locationError, refresh, retry } =
    useWeatherViewModel();

  if (locationStatus === 'denied') {
    return (
      <ScreenContainer>
        <EmptyState
          title="Location access needed"
          message="Storm Chaser needs your location to fetch current conditions. Enable location permissions and try again."
          actionLabel="Try again"
          onAction={retry}
        />
      </ScreenContainer>
    );
  }

  if (locationStatus === 'error' && !snapshot) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Couldn't get your location"
          message={locationError ?? 'Unable to determine your location right now.'}
          actionLabel="Retry"
          onAction={retry}
        />
      </ScreenContainer>
    );
  }

  if ((loading || locationStatus === 'loading' || locationStatus === 'idle') && !snapshot) {
    return (
      <ScreenContainer>
        <Text style={[styles.header, { color: colors.text }]}>Current Conditions</Text>
        <Card style={styles.card}>
          <Skeleton width="60%" height={28} />
          <Skeleton width="40%" height={16} style={{ marginTop: spacing.sm }} />
          <View style={styles.statsRow}>
            <Skeleton width={70} height={40} />
            <Skeleton width={70} height={40} />
            <Skeleton width={70} height={40} />
          </View>
        </Card>
      </ScreenContainer>
    );
  }

  if (notFound || !snapshot) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Weather not found"
          message={errorMessage ?? 'We could not retrieve weather data for your location right now.'}
          actionLabel="Retry"
          onAction={refresh}
        />
      </ScreenContainer>
    );
  }

  const { current, forecast } = snapshot;
  const severe = isSevereWeatherCode(current.weatherCode);

  return (
    <ScreenContainer>
      <FlatList
        data={forecast}
        keyExtractor={(item) => item.date}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <View>
            <Text style={[styles.header, { color: colors.text }]}>Current Conditions</Text>
            <Card style={styles.card}>
              <Text style={[styles.temp, { color: colors.text }]}>{Math.round(current.temperatureC)}°C</Text>
              <Text style={[styles.condition, { color: severe ? colors.severe : colors.textMuted }]}>
                {describeWeatherCode(current.weatherCode)}
                {severe ? ' ⚠️' : ''}
              </Text>
              <View style={styles.statsRow}>
                <WeatherStat label="Wind" value={`${Math.round(current.windSpeedKph)} kph`} />
                <WeatherStat label="Precip" value={`${current.precipitationMm} mm`} />
                <WeatherStat label="Humidity" value={current.humidity != null ? `${current.humidity}%` : '—'} />
              </View>
            </Card>
            <Text style={[styles.header, { color: colors.text, marginTop: spacing.lg }]}>5-Day Forecast</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.forecastCard}>
            <Text style={[styles.forecastDate, { color: colors.text }]}>{item.date}</Text>
            <Text style={{ color: colors.textMuted, flex: 1 }}>{describeWeatherCode(item.weatherCode)}</Text>
            <Text style={{ color: colors.text }}>
              {Math.round(item.tempMinC)}° / {Math.round(item.tempMaxC)}°
            </Text>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: '700', marginBottom: spacing.sm },
  card: { alignItems: 'center', paddingVertical: spacing.lg },
  temp: { fontSize: 48, fontWeight: '800' },
  condition: { fontSize: 16, marginTop: spacing.xs, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', width: '100%', marginTop: spacing.sm },
  forecastCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  forecastDate: { fontWeight: '600', width: 90 },
});
