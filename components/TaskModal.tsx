import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import type { Task } from '@/utils/storage';

function ImagePreview({ uri, onRemove }: { uri: string; onRemove: () => void }) {
  return (
    <View style={{ marginBottom: 10, alignItems: 'center' }}>
      <Image source={{ uri }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 6 }} />
      <Button title="Удалить фото" onPress={onRemove} color="#a9acbbff" />
    </View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: { id?: number; title: string; category: string; image?: string | null }) => void;
  categories: string[];
  initial?: { id?: number; title?: string; category?: string; image?: string | null } | null;
};

export function TaskModal({ visible, onClose, onSave, categories, initial }: Props) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title ?? '');
      setSelectedCategory(initial.category ?? '');
      setImageUri(initial.image ?? null);
      setImageUrlInput(initial.image ?? '');
    } else {
      setTitle('');
      setSelectedCategory('');
      setNewCategory('');
      setImageUri(null);
      setImageUrlInput('');
    }
  }, [initial, visible]);

  const pickImage = async () => {
    try {
      // dynamic import so app still runs if package is not installed
      const ImagePicker = await import('expo-image-picker');
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted === false) {
        Alert.alert('Нет доступа', 'Нужно разрешение на доступ к фото');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      // SDK >= 49 returns result.assets
      const uri = (result as any).assets ? (result as any).assets[0]?.uri : (result as any).uri;
      if (uri) {
        setImageUri(uri);
        setImageUrlInput(uri);
      }
    } catch (e) {
      Alert.alert('Не найден модуль', 'Установите пакет: npx expo install expo-image-picker');
    }
  };

  const save = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название задачи');
      return;
    }
    const category = selectedCategory || newCategory;
    if (!category.trim()) {
      Alert.alert('Ошибка', 'Выберите или создайте категорию');
      return;
    }
    const image = imageUrlInput ? imageUrlInput.trim() : imageUri;
    onSave({ id: initial?.id, title: title.trim(), category: category.trim(), image: image ?? null });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>{initial?.id ? 'Редактировать задачу' : 'Новая задача'}</Text>

        <TextInput placeholder="Задача" value={title} onChangeText={setTitle} style={styles.input} />

        <Text style={styles.label}>Выберите категорию:</Text>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryBtn, item === selectedCategory && styles.selected]}
              onPress={() => {
                setSelectedCategory(item);
                setNewCategory('');
              }}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.label}>Или создайте новую:</Text>
        <TextInput placeholder="Новая категория" value={newCategory} onChangeText={(text) => { setNewCategory(text); if (text) setSelectedCategory(''); }} style={styles.input} />

        <Text style={styles.label}>Прикрепить изображение (или вставить URL):</Text>
        {imageUri ? (
          <ImagePreview uri={imageUri} onRemove={() => { setImageUri(null); setImageUrlInput(''); }} />
        ) : null}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <Button title="Добавить фото" onPress={pickImage} color="#486B85" />
        </View>
        <TextInput placeholder="Вставьте URL изображения" value={imageUrlInput} onChangeText={setImageUrlInput} style={styles.input} />

        <View style={styles.modalButtons}>
          <Button title="Сохранить" onPress={save} color="#486B85" />
          <Button title="Отмена" onPress={onClose} color="#a9acbbff" />
        </View>"
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#383a3fff',
  },
  categoryBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#646668ff',
  },
  selected: {
    backgroundColor: '#e6eaeeff',
  },
  categoryText: {
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
