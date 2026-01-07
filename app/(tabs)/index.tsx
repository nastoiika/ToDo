import React, { useEffect, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';

import { loadTasks, saveTasks, migrateIfNeeded, type Task } from '@/utils/storage';
import { TaskItem } from '@/components/TaskItem';
import { CategoryList } from '@/components/CategoryList';
import { TaskModal } from '@/components/TaskModal';

export default function Index() {
  /* ---------- STATE ---------- */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /* ---------- LOAD / MIGRATE TASKS ---------- */
  useEffect(() => {
    (async () => {
      try {
        // best-effort migration from legacy shape
        await migrateIfNeeded();
        const stored = await loadTasks();
        setTasks(stored);
      } catch {
        Alert.alert('Ошибка', 'Не удалось загрузить задачи');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loadData = async () => {
    try {
      const stored = await loadTasks();
      setTasks(stored);
    } catch {
      // ignore load errors on focus
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  /* ---------- SAVE TASKS ---------- */
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks).catch(() => {});
    }
  }, [tasks, isLoading]);

  /* ---------- CATEGORIES ---------- */
  const categories = useMemo(() => Array.from(new Set(tasks.map(t => t.category))), [tasks]);

  /* ---------- TASK ACTIONS ---------- */
  const onSaveTask = (payload: { id?: number; title: string; category: string; image?: string | null }) => {
    if (payload.id) {
      // Edit existing task
      setTasks(prev => prev.map(t => (t.id === payload.id ? { ...t, title: payload.title, category: payload.category, image: payload.image ?? t.image } : t)));
    } else {
      // Create new task
      setTasks(prev => [...prev, { id: Date.now(), title: payload.title, category: payload.category, done: false, image: payload.image ?? null }]);
    }

    setModalVisible(false);
    setEditingTask(null);
  };

  const onDelete = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));
  const onComplete = (id: number) => setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: true } : t)));
  const onEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  /* ---------- FILTER ---------- */
  const filteredTasks = useMemo(() => tasks.filter(t => !t.done && (!activeCategory || t.category === activeCategory)), [tasks, activeCategory]);

  /* ---------- RENDER LOADING ---------- */
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#486B85" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  /* ---------- RENDER MAIN ---------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Задачи</Text>

      <CategoryList categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />

      <Button title="Добавить задачу" onPress={() => { setEditingTask(null); setModalVisible(true); }} color="#486B85" />

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem task={item} onComplete={onComplete} onEdit={onEdit} onDelete={onDelete} />
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{activeCategory ? `Нет задач в категории "${activeCategory}"` : 'Нет задач. Добавьте первую!'}</Text>
          </View>
        }
      />

      <TaskModal
        visible={modalVisible}
        onClose={() => { setModalVisible(false); setEditingTask(null); }}
        onSave={onSaveTask}
        categories={categories}
        initial={editingTask ? { id: editingTask.id, title: editingTask.title, category: editingTask.category, image: editingTask.image ?? null } : null}
      />
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});