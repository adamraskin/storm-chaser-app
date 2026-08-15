# Storm Chaser

A React Native (Expo) app for storm-chasing hobbyist meteorologists

Built for the Speer Technologies Mobile Development Assessment (React Native Dev).

## Features

- **Weather** — current conditions for your device location (temperature, wind,
  precipitation, humidity) plus a 5-day forecast, via [Open-Meteo](https://open-meteo.com/)
  (no API key required). Shows a dedicated "Weather not found" state if the request
  fails, a distinct state if location can't be determined, skeleton loaders while
  fetching, and pull-to-refresh.
- **Capture** — take a photo with the device camera, then attach metadata: weather
  conditions (auto-filled from your location, editable), GPS coordinates, captured
  timestamp, storm type/classification, and free-text notes.
- **Log** — browse everything you've captured, locally persisted in SQLite. Toggle
  between a list view and a map view showing every documented storm location. Tap
  an entry for full detail, or delete it.
- **Dark mode** — every screen adapts to the system color scheme.

## Tech stack & architecture

- **Expo + TypeScript**, React Navigation (bottom tabs + native stack for the log).
- **MVVM**: each feature has `screens/` (View), a `hooks/useXViewModel.ts` (ViewModel
  — owns state and orchestrates services/repositories), and `services/` (Model —
  API calls / business logic). Screens read from the view-model hook and stay free
  of business logic.
- **Feature-based structure**:
  ```
  src/
    features/
      weather/        screens, hooks, services, components
      storm-capture/   "
      storm-log/       "
    shared/
      db/             SQLite schema + repository (data access layer)
      components/     reusable UI (Card, EmptyState, Skeleton, LabeledInput, ScreenContainer)
      navigation/     RootNavigator (tabs), StormLogNavigator (stack), route types
      hooks/          useCurrentLocation
      types/          domain types shared across features
      theme.ts        light/dark color tokens
  ```
- **Persistence**: `expo-sqlite`. Schema and query helpers live in `src/shared/db`.
  A single `storm_entries` table holds every captured storm with its metadata.

## Implementation decisions

- **Open-Meteo** was used over NWS since it works globally with zero setup and no
  API key
- **SQLite over AsyncStorage**: storm entries are structured, queryable records
  a real schema and indexed lookups are a better fit than a key-value blob, and it
  demonstrates a "proper data model," as the spec asks for.
- **Weather auto-fill on capture**: when a photo is taken, current conditions are
  fetched for the entry automatically but remain editable, in case the user wants to
  log something the API didn't capture (e.g. hail size).
- **Request timeouts and unmount guards** were added to both the location hook and
  the weather API client after a review pass surfaced that a hung network/GPS request
  would otherwise leave a screen stuck loading indefinitely.

## Running the app

```bash
npm install
npm start        # then press i / a / w, or scan the QR code with Expo Go
```

## Testing

```bash
npm test
```

## AI tools used

- Claude Code used throughout development.

## What it was used for

- Scaffolding the project (`create-expo-app`, dependency installation, folder structure).
- Designing and implementing front end, React Nav tabs
- Writing the unit tests (`weatherCodes.test.ts`, `weatherApi.test.ts`).
- development assistance throughout, some design decision insight
- documentation, outlining, comments, styling consistency
