
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCpCsRVG22_qdQ_7EoY4iw2AwmbXcEgjjY',
  authDomain: 'plant-78fdf.firebaseapp.com',
  projectId: 'plant-78fdf',
  storageBucket: 'plant-78fdf.firebasestorage.app',
  messagingSenderId: '610274797102',
  appId: '1:610274797102:web:05c6a733a24105849021bf',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Page = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome {user?.email || 'Guest'}</Text>
      {user && <Button title="Sign out" onPress={() => signOut(auth)} />}
    </View>
  );
};

export default Page;

