import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const seedOptions = [
  {
    name: "Sunflower",
    image: require("../../assets/sunflower.jpg"),
    description: "A sunflower is a plant that loves light and brings joy.",
    route: "/ListofPlants/Sunflower",
  },
  {
    name: "Cress",
    image: require("../../assets/cress.jpg"),
    description: "Watercress is a fast—growing plant with a piquant taste.",
    route: "/ListofPlants/Cress",
  },
  {
    name: "Mint",
    image: require("../../assets/mint.jpeg"),
    description: "Mint is a fragrant plant, refreshing and healthy.",
    route: "/ListofPlants/Mint",
  },
  {
    name: "Pea",
    image: require("../../assets/goroh.jpeg"),
    description: "Peas are a legume plant rich in protein and vitamins.",
    route: "/ListofPlants/Goroh",
  },
  {
    name: "Basil",
    image: require("../../assets/bazilik.jpg"),
    description: "Basil is a spicy plant with a rich aroma, popular in cooking.",
    route: "/ListofPlants/Bazilik",
  },
];

export default function PlantScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [availableSeeds, setAvailableSeeds] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        if (userData?.seeds !== undefined) {
          setAvailableSeeds(userData.seeds);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handlePlant = async (plant: { name: string; image: any }) => {
    if (!user) return;
    if (availableSeeds < 1) {
      Alert.alert("No seeds", "Replenish your seed supply to plant a plant.");
      return;
    }
  
    const db = getFirestore();
    const newPlantData = {
      name: plant.name,
      seedDate: new Date().toISOString().split("T")[0],
      comment: "",
      userId: user.uid,
    };
  
    // 1. Сохраняем в Firestore
    const docRef = await addDoc(collection(db, "plants"), newPlantData);
    const plantId = docRef.id;
  
    // 2. Сохраняем в AsyncStorage для совместимости с текущим HomeScreen (можно позже убрать)
    const storedPlants = await AsyncStorage.getItem("plants");
    const plants = storedPlants ? JSON.parse(storedPlants) : [];
    const updatedPlants = [
      ...plants,
      {
        ...newPlantData,
        id: plantId,
        image: plant.image,
        date: new Date().toDateString(),
      },
    ];
    await AsyncStorage.setItem("plants", JSON.stringify(updatedPlants));
  
    // 3. Обновляем количество семян
    await updateDoc(doc(db, "users", user.uid), {
      seeds: availableSeeds - 1,
    });
  
    setAvailableSeeds((prev) => prev - 1);
    Alert.alert("Успешно!", `${plant.name} посажено! 🌱`);
  
    // 4. Переход на GameScreen с новым plantId
    router.push({ pathname: "/game/GameScreen", params: { plantId } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Plants</Text>
      <Text style={styles.seeds}>Seeds: {availableSeeds}</Text>

      <FlatList
        data={seedOptions}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push(item.route as any)}>
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handlePlant(item)}>
              <Text style={styles.buttonText}>Planting</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7ec",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
    textAlign: "center",
  },
  seeds: {
    textAlign: "center",
    marginBottom: 10,
    color: "#4a654a",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 220,
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    color: "#555",
    marginVertical: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#7aa17a",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});