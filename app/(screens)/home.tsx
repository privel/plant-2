import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const firebaseConfig = {
  apiKey: "AIzaSyCpCsRVG22_qdQ_7EoY4iw2AwmbXcEgjjY",
  authDomain: "plant-78fdf.firebaseapp.com",
  projectId: "plant-78fdf",
  storageBucket: "plant-78fdf.firebasestorage.app",
  messagingSenderId: "610274797102",
  appId: "1:610274797102:web:05c6a733a24105849021bf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function HomeScreen() {
  const router = useRouter();
  const [plants, setPlants] = useState<Array<{ id: string; name: string; date: string; image?: any }>>([]);
  const [filteredPlants, setFilteredPlants] = useState<typeof plants>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [availableSeeds, setAvailableSeeds] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const searchInputRef = useRef<TextInput>(null);

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    const storedPlants = await AsyncStorage.getItem("plants");
    if (storedPlants) {
      const allPlants = JSON.parse(storedPlants);
      const userPlants = allPlants.filter((plant: any) => plant.userId === user.uid);
      const withImages = userPlants.map((plant: any) => ({
        ...plant,
        image: getImageForPlant(plant.name),
      }));
      setPlants(withImages);
      setFilteredPlants(withImages);
    }

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    if (userData?.seeds !== undefined) {
      setAvailableSeeds(userData.seeds);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData) {
          if (!userData.welcomeShown) {
            await updateDoc(userRef, {
              welcomeShown: true,
              seeds: 1,
            });
            setAvailableSeeds(1);
            setShowWelcome(true);
          } else {
            setAvailableSeeds(userData.seeds || 0);
          }
        }
      }
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadPlants = async () => {
        if (!user) return;
        const storedPlants = await AsyncStorage.getItem("plants");
        if (storedPlants) {
          const allPlants = JSON.parse(storedPlants);
          const userPlants = allPlants.filter((plant: any) => plant.userId === user.uid);
          const withImages = userPlants.map((plant: any) => ({
            ...plant,
            image: getImageForPlant(plant.name),
          }));
          setPlants(withImages);
          setFilteredPlants(withImages);
        }
      };
      loadPlants();
    }, [user])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = plants.filter((plant) =>
      plant.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPlants(filtered);
  };

  const renderHeader = () => (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        
        <Text style={{ fontWeight: "bold", color: "#091E09FF" }}>Seeds: {availableSeeds}</Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 20 }}>My Plants</Text>
      <TextInput
        ref={searchInputRef}
        value={search}
        onChangeText={handleSearch}
        placeholder="Search plant..."
        placeholderTextColor="#777"
        style={{
          backgroundColor: "#fff",
          padding: 10,
          borderRadius: 10,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 16,
        }}
        returnKeyType="done"
        blurOnSubmit={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <LinearGradient colors={["#CBD5B1", "#F9F9F9"]} style={{ flex: 1 }}>
        <Modal visible={showWelcome} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Welcome!</Text>
              <Text style={styles.modalText}>You have been awarded 1 seed 🌱</Text>
              <TouchableOpacity onPress={() => setShowWelcome(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Thanks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <FlatList
          data={filteredPlants}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#4CAF50"]}
              tintColor="#4CAF50"
              progressBackgroundColor="#E6F4EA"
            />
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/game/GameScreen", params: { plantId: item.id } })}
              style={styles.plantCard}
            >
              {item.image && <Image source={item.image} style={styles.plantImage} />}
              <Text style={styles.plantName}>{item.name}</Text>
              <Text style={styles.plantDate}>The record has been created   <Text style={{fontWeight: "bold",}}>{item.date}</Text></Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/PlantScreen")}>        
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={() => router.push("/FunGame/Base")}>        
          <Text style={styles.playText}>PLAY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatButton} onPress={() => router.push("/ChatScreen")}>        
          <Ionicons name="chatbubbles" size={30} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const getImageForPlant = (name: string) => {
  switch (name) {
    case "Sunflower":
      return require("../../assets/sunflower.jpg");
    case "Cress":
      return require("../../assets/cress.jpg");
    case "Mint":
      return require("../../assets/mint.jpeg");
    case "Pea":
      return require("../../assets/goroh.jpeg");
    case "Basil":
      return require("../../assets/bazilik.jpg");
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#7aa17a",
    padding: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  plantCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
  },
  plantImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  plantDate: {
    color: "gray",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7CA982",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  chatButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#4A90E2",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  playButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
  },
  playText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});