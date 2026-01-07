import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tabIconSelected,
        tabBarStyle: { backgroundColor: '#1C252B' },
        headerShown: true,
        headerStyle: { backgroundColor: '#1C252B' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Активные',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="done"
        options={{
          title: 'Завершённые',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}