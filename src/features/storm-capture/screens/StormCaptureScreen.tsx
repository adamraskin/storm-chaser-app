import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { Card } from '../../../shared/components/Card';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LabeledInput } from '../../../shared/components/LabeledInput';
import { spacing, radii, useThemeColors } from '../../../shared/theme';
import { useStormCaptureViewModel } from '../hooks/useStormCaptureViewModel';
import { StormTypePicker } from '../components/StormTypePicker';

export function StormCaptureScreen() {
  const colors = useThemeColors();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturing, setCapturing] = useState(false);

  const {
    coords,
    locationStatus,
    photoUri,
    form,
    updateForm,
    capturePhoto,
    retake,
    save,
    saving,
    canSave,
  } = useStormCaptureViewModel();

  if (!permission) {
    return (
      <ScreenContainer>
        <ActivityIndicator color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Camera access needed"
          message="Storm Chaser needs camera access to document storms."
          actionLabel="Grant permission"
          onAction={requestPermission}
        />
      </ScreenContainer>
    );
  }

  if (!photoUri) {
    return (
      <ScreenContainer>
        <View style={styles.cameraWrap}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        </View>
        <TouchableOpacity
          style={[styles.shutter, { borderColor: colors.primary }]}
          disabled={capturing}
          accessibilityRole="button"
          accessibilityLabel="Capture photo"
          onPress={async () => {
            if (!cameraRef.current) return;
            setCapturing(true);
            try {
              const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
              if (photo?.uri) {
                await capturePhoto(photo.uri);
              }
            } catch (err) {
              Alert.alert('Capture failed', 'Could not take photo. Please try again.');
            } finally {
              setCapturing(false);
            }
          }}
        >
          {capturing ? <ActivityIndicator color={colors.primary} /> : <View style={[styles.shutterInner, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
        {locationStatus === 'denied' && (
          <Text style={[styles.warning, { color: colors.warning }]}>
            Location is off — coordinates won't be saved with this entry.
          </Text>
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <Image source={{ uri: photoUri }} style={styles.preview} />

          <Card style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Location & Time</Text>
            <Text style={{ color: colors.textMuted }}>
              {coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Unavailable'}
            </Text>
            <Text style={{ color: colors.textMuted, marginTop: spacing.xs }}>{new Date().toLocaleString()}</Text>
          </Card>

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
            Storm Type
          </Text>
          <StormTypePicker value={form.stormType} onChange={(v) => updateForm('stormType', v)} />

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
            Weather Conditions {form.weatherLoading ? '(loading…)' : ''}
          </Text>
          {form.weatherError && <Text style={{ color: colors.warning, marginBottom: spacing.sm }}>{form.weatherError}</Text>}
          <LabeledInput
            label="Temperature (°C)"
            keyboardType="numeric"
            value={form.temperatureC != null ? String(form.temperatureC) : ''}
            onChangeText={(t) => updateForm('temperatureC', t ? Number(t) : null)}
          />
          <LabeledInput
            label="Wind speed (kph)"
            keyboardType="numeric"
            value={form.windSpeedKph != null ? String(form.windSpeedKph) : ''}
            onChangeText={(t) => updateForm('windSpeedKph', t ? Number(t) : null)}
          />
          <LabeledInput
            label="Precipitation (mm)"
            keyboardType="numeric"
            value={form.precipitationMm != null ? String(form.precipitationMm) : ''}
            onChangeText={(t) => updateForm('precipitationMm', t ? Number(t) : null)}
          />
          <LabeledInput
            label="Conditions summary"
            value={form.weatherSummary ?? ''}
            onChangeText={(t) => updateForm('weatherSummary', t)}
            placeholder="e.g. Thunderstorm"
          />
          <LabeledInput
            label="Notes"
            value={form.notes}
            onChangeText={(t) => updateForm('notes', t)}
            placeholder="Describe what you observed…"
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={retake}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: canSave ? 1 : 0.5 }]}
              disabled={!canSave || saving}
              onPress={async () => {
                const entry = await save();
                if (entry) {
                  Alert.alert('Saved', 'Storm entry saved to your log.');
                }
              }}
            >
              {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Save Entry</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cameraWrap: { flex: 1, borderRadius: radii.lg, overflow: 'hidden' },
  camera: { flex: 1 },
  shutter: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  shutterInner: { width: 56, height: 56, borderRadius: 28 },
  warning: { textAlign: 'center', marginBottom: spacing.sm },
  preview: { width: '100%', aspectRatio: 4 / 3, borderRadius: radii.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  secondaryButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  primaryButton: { flex: 2, paddingVertical: spacing.md, borderRadius: radii.md, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700' },
});
