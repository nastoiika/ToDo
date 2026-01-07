# Copilot / AI Agent Instructions for Todo App

Short, actionable guidance to get productive quickly in this repository.

## Quick snapshot
- Expo-managed React Native app using `expo-router` (file-based routing). See `package.json` (`main: expo-router/entry`).
- TypeScript with `strict: true` and path alias `@/*` (see `tsconfig.json`).
- Lightweight, single-screen task app that persists to `AsyncStorage` under key `tasks`.

## How to run (common commands)
- Install: `npm install`
- Start dev server: `npx expo start` (or `npm run start`)
- Open on Android / iOS / web: `npm run android`, `npm run ios`, `npm run web`
- Lint: `npm run lint` (uses `expo lint` / `eslint-config-expo`)
- Reset starter project: `npm run reset-project` (runs `scripts/reset-project.js`) — **do not modify this script without checking implications**.

## Key files & conventions (examples)
- Routing: `app/_layout.tsx` (top-level Stack, includes modal config and `unstable_settings.anchor = '(tabs)'`). To add a tabbed screen, place it under `app/(tabs)/`.
- Example screen: `app/(tabs)/index.tsx` — stores tasks with:
  ```ts
  interface Task { id: number; title: string; category: string; done: boolean }
  // persisted via AsyncStorage.getItem('tasks') / setItem('tasks', JSON.stringify(tasks'))
  ```
- Theming: use `components/ThemedText` / `components/ThemedView` and `hooks/use-theme-color.ts` which reads from `constants/theme.ts` (Colors.light / Colors.dark). Prefer `useThemeColor(...)` over hardcoding colors.
- Path alias: import with `@/...` (configured in `tsconfig.json`).
- Platform-specific files: e.g., `components/ui/icon-symbol.ios.tsx` — follow platform naming when necessary.

## Integration points & constraints
- Persistence: `AsyncStorage` is the single source-of-truth for tasks — changing the storage shape requires a migration strategy (version key or data transform on load).
- Routing: uses file-based routing from `expo-router`; adding/removing routes is done by adding/removing files under `app/` (or updating layout stacks when adding new navigation stacks).
- Reanimated: `react-native-reanimated` is imported for side-effects in `app/_layout.tsx` (`import 'react-native-reanimated'`) — be careful when altering setup.

## Coding style & PR guidance
- Follow existing patterns: TS `strict` types, functional React components, `Themed*` primitives for color handling.
- Keep changes small & focused (component + style + type updates together), add a short note in the PR about why storage/routing changes are necessary.
- Run `npm run lint` and smoke-test with `npx expo start` (web or emulator) before creating a PR.

## When you're unsure
- If changes affect stored data shape, propose a migration or add a `dataVersion` check in load logic.
- If a new route needs to be modal or presented differently, mirror patterns from `app/_layout.tsx` (Stack.Screen options).
- Ask for clarity on UX decisions (category behavior, edit flows) before reworking persistence or major UI flows.

---
## Migration example (practical)
When changing the storage shape for `tasks` prefer a versioned payload and a migration helper. Example (see `utils/storage.ts`):

```ts
// loadTasks() handles legacy array shape and v2: { version: 2, data: Task[] }
// saveTasks() writes versioned payload
// migrateIfNeeded() upgrades legacy array -> v2 in-place
```

Use `await migrateIfNeeded()` before `loadTasks()` in index screens so the app recovers gracefully from older data.

Note: Image picking uses `expo-image-picker`. To enable selecting photos from device, run:

```bash
cd todo-app
npx expo install expo-image-picker
```
If the package isn't installed, the app will fall back to pasting an image URL in the modal.
## How to add a screen (quick snippet)
This project uses `expo-router` file-based routing:
1. Add file `app/new-screen.tsx` (or `app/(tabs)/new.tsx` for a tabbed screen).
2. Export a default React component (use `ThemedView` / `ThemedText` for consistent theme colors).
3. If the screen should be shown as a modal, add it to `app/_layout.tsx` as a `Stack.Screen` with `options={{ presentation: 'modal' }}`.

Example file:
```tsx
// app/new-screen.tsx
import { ThemedView, ThemedText } from '@/components/themed-text';
export default function NewScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">New screen</ThemedText>
    </ThemedView>
  );
}
```

---
If you'd like, I can add a ready-made migration test, or open a PR that splits `app/(tabs)/index.tsx` into the new components and runs `npm run lint -- --fix` automatically. Which should I do next?