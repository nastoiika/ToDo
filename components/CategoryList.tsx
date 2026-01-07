import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  categories: string[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryList({ categories, activeCategory, onSelect }: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      extraData={activeCategory}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.categoryBtn, item === activeCategory && styles.selected]}
          onPress={() => onSelect(item === activeCategory ? null : item)}
        >
          <Text style={styles.categoryText}>{item}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingVertical: 10 }}
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={<Text style={styles.emptyText}>Нет категорий</Text>}
    />
  );
}

const styles = StyleSheet.create({
  categoryBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  selected: {
    backgroundColor: '#e6eaeeff',
  },
  categoryText: {
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
});
