import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";

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

const plants = [
  { id: "1", name: "Sunflower", date: "Apr 21", image: require("../../assets/sunflower.jpg") },
  { id: "2", name: "Radish", date: "Apr 22", image: require("../../assets/cress.jpg") },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [seedInfo, setSeedInfo] = useState<{ name: string; image: string } | null>(null);
  const [isPlanted, setIsPlanted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        if (userData && userData.seed && !userData.welcomeShown) {
          setSeedInfo(userData.seed);
          setShowWelcome(true);
        }
        if (userData?.planted) {
          setIsPlanted(true);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleAccept = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        welcomeShown: true,
      });
    }
    setShowWelcome(false);
  };

  const handlePlant = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        planted: true,
      });
      setIsPlanted(true);
    }
  };

  return (
    <LinearGradient colors={["#CBD5B1", "#F9F9F9"]} style={{ flex: 1 }}>
      <Modal visible={showWelcome} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Поздравляем!</Text>
            <Text style={styles.modalText}>Вы получили растение: {seedInfo?.name}</Text>
            {seedInfo?.image && (
              <Image source={{ uri: seedInfo.image }} style={styles.modalImage} />
            )}
            <TouchableOpacity onPress={handleAccept} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Принять</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="sunny" size={24} color="#FACC15" />
                <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: "bold" }}>72°</Text>
              </View>
            </View>

            {!isPlanted && (
              <TouchableOpacity onPress={handlePlant} style={{
                backgroundColor: "#7aa17a",
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
                alignSelf: "center"
              }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Посадить</Text>
              </TouchableOpacity>
            )}

            <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 20 }}>My Beds</Text>
          </>
        )}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "white", borderRadius: 15, marginBottom: 15, padding: 10 }}>
            <Image source={item.image} style={{ width: "100%", height: 120, borderRadius: 10 }} />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{item.name}</Text>
            <Text style={{ color: "gray" }}>Sowed {item.date}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={{
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
        }}
        onPress={() => {
          console.log("Кнопка + нажата");
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
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
        }}
        onPress={() => router.push("/ChatScreen")}
      >
        <Ionicons name="chatbubbles" size={30} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

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
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
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
});