import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Alert } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { loadTasks, saveTasks, type Task } from '@/utils/storage';
import { TaskItem } from '@/components/TaskItem';

export default function DoneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const all = await loadTasks();
      setTasks(all.filter(t => t.done));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      // update global storage
      const all = await loadTasks();
      const updatedAll = all.filter(t => t.id !== id);
      await saveTasks(updatedAll);
      // update local view
      setTasks(updatedAll.filter(t => t.done));
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось удалить задачу');
    }
  };

  return (
    <ThemedView style={styles.container}>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem task={item} onComplete={() => {}} onEdit={() => {}} onDelete={deleteTask} />
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>Нет завершённых задач</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
});