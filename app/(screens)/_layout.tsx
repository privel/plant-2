import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const Layout = () => {
  const router = useRouter();  

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
          <TouchableOpacity onPress={() => router.push('/profile')} style={{ marginLeft: 15 }}>
            <Ionicons name="person-circle-outline" size={26} color="#3a5f3a" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="home" options={{ title: 'My Garden', headerShown: true }} />
    </Stack>
  );
};

export default Layout;
