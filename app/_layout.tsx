import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import {firebaseConfig} from "../constants/firebaseConfig";


// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(screens)';

    if (user && !inAuthGroup) {
      router.replace('/(screens)/home');
    } else if (!user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown:false,title: 'Login' }} />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      
    </Stack>
  );
}
