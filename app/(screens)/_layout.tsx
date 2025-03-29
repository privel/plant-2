import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#CBD5B1',
        },
        headerTintColor: '#3a5f3a',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => alert('Профиль')} style={{ marginLeft: 15 }}>
            <Ionicons name="person-circle-outline" size={26} color="#3a5f3a" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => alert('Поиск')} style={{ marginRight: 15 }}>
            <Ionicons name="search-outline" size={24} color="#3a5f3a" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="home" options={{ title: 'My Garden', headerShown: true }} />
    </Stack>
  );
};

export default Layout;
