import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import type { Task } from '@/utils/storage';

type Props = {
  task: Task;
  onComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

export function TaskItem({ task, onComplete, onEdit, onDelete }: Props) {
  return (
    <View style={styles.task}>
      {task.image ? <Image source={{ uri: task.image }} style={styles.image} /> : null}
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskCategory}>{task.category}</Text>
      <View style={styles.row}>
        {!task.done && (
          <>
            <TouchableOpacity style={styles.iconBtn} onPress={() => onComplete(task.id)} accessibilityLabel="complete">
              <Text style={styles.iconText}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(task)} accessibilityLabel="edit">
              <Text style={styles.iconText}>✎</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(task.id)} accessibilityLabel="delete">
          <Text style={styles.deleteText}>✖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  task: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  iconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#486B85',
    fontSize: 16,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    // no background: show unfilled cross
  },
  deleteText: {
    color: '#486B85',
    fontSize: 16,
  },
});
