
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

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

const plants = [
  { id: "1", name: "Sunflower", date: "Apr 21", image: require("../../assets/sunflower.jpg") },
  { id: "2", name: "Radish", date: "Apr 22", image: require("../../assets/cress.jpg") },
];

export default function App() {
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return (
    <LinearGradient colors={["#CBD5B1", "#F9F9F9"]} style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="sunny" size={24} color="#FACC15" />
          <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: "bold" }}>72°</Text>
        </View>
        <Ionicons name="search" size={24} color="#333" />
      </View>

      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 20 }}>My Beds</Text>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "white", borderRadius: 15, marginBottom: 15, padding: 10 }}>
            <Image source={item.image} style={{ width: "100%", height: 120, borderRadius: 10 }} />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{item.name}</Text>
            <Text style={{ color: "gray" }}>Sowed {item.date}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={{
        position: "absolute", bottom: 20, right: 20,
        backgroundColor: "#7CA982", width: 50, height: 50,
        borderRadius: 25, justifyContent: "center", alignItems: "center"
      }}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}
