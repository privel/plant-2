// game/GameScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";

const db = getFirestore();
const auth = getAuth();

export default function GameScreen() {
  const { plantId } = useLocalSearchParams();
  const router = useRouter();

  const [plant, setPlant] = useState<any>(null);
  const [water, setWater] = useState(0);
  const [sun, setSun] = useState(0);
  const [fertilizer, setFertilizer] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [isDead, setIsDead] = useState(false);

  const feedbackColor = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const loadPlant = async () => {
      const user = auth.currentUser;
      if (!user || !plantId) return;

      const storedPlants = await AsyncStorage.getItem("plants");
      if (storedPlants) {
        const allPlants = JSON.parse(storedPlants);
        const currentPlant = allPlants.find((p: any) => p.id === plantId && p.userId === user.uid);
        if (currentPlant) setPlant(currentPlant);
      }
    };
    loadPlant();
  }, [plantId]);

  useEffect(() => {
    if (growth >= 1) {
      giveSeed();
    }
    if (water > 7 || sun > 7 || fertilizer > 7) {
      killPlant();
    }
  }, [growth, water, sun, fertilizer]);

  const giveSeed = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const seeds = userData?.seeds ?? 0;
    await updateDoc(userRef, {
      seeds: seeds + 1,
    });
    Alert.alert("Поздравляем!", "Вы вырастили растение и получили 1 семечко 🌱");
    setGrowth(0);
    setWater(0);
    setSun(0);
    setFertilizer(0);
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const killPlant = async () => {
    setIsDead(true);
    const user = auth.currentUser;
    if (!user || !plantId) return;

    const storedPlants = await AsyncStorage.getItem("plants");
    if (storedPlants) {
      let allPlants = JSON.parse(storedPlants);
      allPlants = allPlants.filter((p: any) => !(p.id === plantId && p.userId === user.uid));
      await AsyncStorage.setItem("plants", JSON.stringify(allPlants));
    }
  };

  const flashFeedback = (positive: boolean) => {
    Animated.sequence([
      Animated.timing(feedbackColor, {
        toValue: positive ? 1 : -1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(feedbackColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    if (!positive) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]),
        Animated.timing(scaleAnim, {
          toValue: Math.max(0.7, scaleAnim.__getValue() - 0.05),
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0.8 + growth * 0.2,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCare = (type: "water" | "sun" | "fertilizer") => {
    if (isDead) return;
    if (type === "water") setWater((prev) => prev + 1);
    if (type === "sun") setSun((prev) => prev + 1);
    if (type === "fertilizer") setFertilizer((prev) => prev + 1);

    const newGrowth = Math.min(
      ((water + 1) / 5 + (sun + 1) / 5 + (fertilizer + 1) / 5) / 3,
      1
    );
    setGrowth(newGrowth);

    const isGood = newGrowth > growth;
    flashFeedback(isGood);
  };

  const bgColor = feedbackColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["#f8d7da", "#E8F3E8", "#d4edda"]
  });

  const animatedStyle = {
    transform: [
      { translateX: shakeAnim },
      { scale: scaleAnim }
    ]
  };

  if (!plant) return <Text style={styles.text}>Загрузка...</Text>;
  if (isDead)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ваше растение погибло 💀</Text>
        <Button title="Вернуться" onPress={() => router.back()} />
      </View>
    );

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>{plant.name}</Text>
      <Animated.Image source={plant.image} style={[styles.image, animatedStyle]} />
      <Text style={styles.text}>Рост: {(growth * 100).toFixed(1)}%</Text>
      <Text style={styles.text}>Полив: {water} / 7</Text>
      <Text style={styles.text}>Свет: {sun} / 7</Text>
      <Text style={styles.text}>Удобрение: {fertilizer} / 7</Text>

      <View style={styles.buttonRow}>
        <Button title="Полить" onPress={() => handleCare("water")} />
        <Button title="Свет" onPress={() => handleCare("sun")} />
        <Button title="Удобрить" onPress={() => handleCare("fertilizer")} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3A5A40",
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#3A5A40",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
});