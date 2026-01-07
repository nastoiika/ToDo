import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Button, Modal,
  TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Task {
  id: number;
  title: string;
  category: string;
  done: boolean;
}

export default function Index() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const theme = useColorScheme() ?? 'light';

  /* ---------- STORAGE ---------- */
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
    };
    saveData();
  }, [tasks, categories]);

  const loadData = async () => {
    try {
      const t = await AsyncStorage.getItem('tasks');
      const c = await AsyncStorage.getItem('categories');
      if (t) setTasks(JSON.parse(t));
      if (c) setCategories(JSON.parse(c));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  /* ---------- TASKS ---------- */
  const saveTask = () => {
    if (!title || !selectedCategory) {
      Alert.alert('Ошибка', 'Введите задачу и выберите категорию');
      return;
    }

    if (editingId) {
      setTasks(tasks.map(t =>
        t.id === editingId ? { ...t, title, category: selectedCategory } : t
      ));
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        title,
        category: selectedCategory,
        done: false
      }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setSelectedCategory('');
    setEditingId(null);
    setModalVisible(false);
  };

  const completeTask = (id: number) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, done: true } : t));

  const editTask = (task: Task) => {
    setTitle(task.title);
    setSelectedCategory(task.category);
    setEditingId(task.id);
    setModalVisible(true);
  };

  const deleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);

    const stillUsed = updated.some(t => t.category === task.category);
    if (!stillUsed) {
      setCategories(categories.filter(c => c !== task.category));
      if (selectedCategory === task.category) setSelectedCategory('');
    }
  };

  /* ---------- CATEGORIES ---------- */
  const addCategory = () => {
    const cat = newCategory.trim();
    if (!cat) return;
    if (categories.includes(cat)) {
      Alert.alert('Ошибка', 'Категория уже существует');
      return;
    }
    setCategories([...categories, cat]);
    setNewCategory('');
  };

  /* ---------- UI ---------- */
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.task}>
      <Text>{item.title} ({item.category})</Text>
      <View style={styles.row}>
        {!item.done && (
          <>
            <TouchableOpacity style={styles.iconBtn} onPress={() => completeTask(item.id)} accessibilityLabel="complete">
              <Text style={styles.iconText}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => editTask(item)} accessibilityLabel="edit">
              <Text style={styles.iconText}>✎</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTask(item.id)} accessibilityLabel="delete">
          <Text style={styles.deleteText}>✖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredTasks = activeCategory
    ? tasks.filter(t => !t.done && t.category === activeCategory)
    : tasks.filter(t => !t.done);

  return (
    <View style={styles.container}>
      {/* Категории */}
      <Text style={styles.subtitle}>Категории:</Text>
      <View style={styles.categoriesBlock}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          style={{ marginBottom: 6 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                item === activeCategory && styles.selectedCategory
              ]}
              onPress={() =>
                setActiveCategory(
                  item === activeCategory ? null : item
                )
              }
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={[styles.addBtn, { backgroundColor: Colors[theme].tint }]} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>Добавить задачу</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Активные задачи:</Text>
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={i => i.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет активных задач</Text>
        }
      />

      {/* ---------- MODAL ---------- */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={resetForm}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {editingId ? 'Редактирование' : 'Новая задача'}
          </Text>

          <TextInput
            placeholder="Задача"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Категории:</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryBtn,
                  item === selectedCategory && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={styles.categoryText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={i => i}
          />

          <View style={styles.newCategoryRow}>
            <TextInput
              placeholder="Новая категория"
              value={newCategory}
              onChangeText={setNewCategory}
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#999"
            />
            <Button title="+" onPress={addCategory} />
          </View>

          <View style={styles.modalButtons}>
            <Button title="Сохранить" onPress={saveTask} />
            <Button title="Отмена" onPress={resetForm} color="#999" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#000'
  },
  label: {
    marginTop: 10,
    color: '#000',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: '#999',
    borderRadius: 5,
    color: '#000'
  },
  task: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    gap: 5
  },
  iconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
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
    marginLeft: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    // no background: unfilled cross
  },
  deleteText: {
    color: '#486B85',
    fontSize: 16,
  },
  categoryBtn: {
    padding: 8,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    marginBottom: 10
  },
  selectedCategory: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50'
  },
  categoryText: {
    color: '#000'
  },
  newCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 5
  },
  modalButtons: {
    gap: 10
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20
  },
  categoriesBlock: {
    marginBottom: 6,
  },
  addBtn: {
    marginTop: 0,
    marginBottom: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  }
});