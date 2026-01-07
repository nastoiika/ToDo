import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: number;
  title: string;
  category: string;
  done: boolean;
  // optional image URI (local or remote)
  image?: string | null;
}

// Stored payload is still versioned; data: Task[] may include `image` in tasks
type StoredV2 = { version: 2; data: Task[] };

type StoredLegacy = Task[];

const STORAGE_KEY = 'tasks';

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    // v2 shape: { version: 2, data: Task[] }
    if (parsed && typeof parsed === 'object' && parsed.version === 2 && Array.isArray(parsed.data)) {
      return parsed.data as Task[];
    }

    // legacy shape: Task[] directly
    if (Array.isArray(parsed)) {
      return parsed as Task[];
    }

    // unknown shape: attempt to recover
    if (Array.isArray(parsed.tasks)) {
      return parsed.tasks as Task[];
    }

    return [];
  } catch (e) {
    // If parsing fails, return empty and let UI handle empty state
    return [];
  }
}

export async function saveTasks(tasks: Task[]) {
  // Save in a versioned structure so future migrations are easier
  const payload: StoredV2 = { version: 2, data: tasks };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// Optional helper: migrate from legacy array shape to v2 shape in-place
export async function migrateIfNeeded() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const payload: StoredV2 = { version: 2, data: parsed };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  } catch (e) {
    // swallow - migration is best effort
  }
}
