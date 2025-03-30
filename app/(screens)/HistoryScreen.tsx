import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (!user) return;

      try {
        const historyRef = collection(db, 'users', user.uid, 'nameHistory');
        const q = query(historyRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.oldName}>Old Name: {item.oldName}</Text>
      <Text style={styles.date}>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3a5f3a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Name Change History</Text>
      </View> */}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#CBD5B1',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a5f3a',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  oldName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
});

export default HistoryScreen;
