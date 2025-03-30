import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const [name, setName] = useState('Your Name');
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveName = async () => {
    if (newName.trim() === '') return;

    const auth = getAuth();
    const db = getFirestore();
    const uid = auth.currentUser?.uid;

    if (!uid) return;

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          name: newName.trim(),
        },
        { merge: true }
      );

      setName(newName.trim());
      closeModal();
    } catch (error) {
      console.error('Error saving name to Firestore:', error);
    }
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (!user) return;

      setEmail(user.email || '');

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.name) {
            setName(userData.name);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F6F2', padding: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
      <View
  style={{
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3a5f3a',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }}
>
  <Ionicons name="person-outline" size={80} color="#3a5f3a" />
</View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3a5f3a', marginTop: 10 }}>
          {name}
        </Text>
        <Text style={{ fontSize: 16, color: '#6B6B6B' }}>{email}</Text>

        <TouchableOpacity
          onPress={() => {
            setNewName(name);
            setModalVisible(true);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            }).start();
          }}
          style={{
            marginTop: 10,
            paddingHorizontal: 20,
            paddingVertical: 6,
            borderRadius: 12,
            backgroundColor: '#3a5f3a',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>Edit Name</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Ionicons name="leaf-outline" size={24} color="#3a5f3a" />
          <Text style={{ marginLeft: 15, fontSize: 16, color: '#3a5f3a' }}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Ionicons name="settings-outline" size={24} color="#3a5f3a" />
          <Text style={{ marginLeft: 15, fontSize: 16, color: '#3a5f3a' }}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 15 }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
          <Text style={{ marginLeft: 15, fontSize: 16, color: '#d9534f' }}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Modal */}
      {isModalVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              closeModal();
            }}
          >
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
          </TouchableWithoutFeedback>

          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 15,
              width: '80%',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Name</Text>
            <TextInput
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 10,
                marginBottom: 15,
              }}
            />
            <TouchableOpacity
              onPress={handleSaveName}
              style={{
                backgroundColor: '#3a5f3a',
                padding: 10,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default ProfileScreen;