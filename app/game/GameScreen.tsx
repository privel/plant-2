import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper"; // Для шкал воды, удобрений и температуры

const auth = getAuth();
const db = getFirestore();

export default function GameScreen() {
  const { plantId } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState<any>(null);
  const [journal, setJournal] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [newComment, setNewComment] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Уровень воды, удобрений и температуры
  const [waterLevel, setWaterLevel] = useState<number>(50);
  const [fertilizerLevel, setFertilizerLevel] = useState<number>(30);
  const [temperature, setTemperature] = useState<number>(20);

  useEffect(() => {
    const loadPlant = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !plantId) return;

        const plantRef = doc(db, "plants", plantId as string);
        const plantSnap = await getDoc(plantRef);
        if (plantSnap.exists()) {
          const plantData = plantSnap.data();
          setPlant(plantData);
          setNewName(plantData.name);
          setNewDate(new Date(plantData.seedDate));
          setNewComment(plantData.comment);
          setWaterLevel(plantData.waterLevel || 50);
          setFertilizerLevel(plantData.fertilizerLevel || 30);
          setTemperature(plantData.temperature || 20);
        }

        const journalRef = collection(db, "plants", plantId as string, "journal");
        const journalSnap = await getDocs(journalRef);
        const journalData = journalSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJournal(journalData);
      } catch (error) {
        console.error("Failed to load plant:", error);
      }
    };

    loadPlant();
  }, [plantId]);

  // Сохранение изменений растения
  const savePlantChanges = async () => {
    if (!plantId) return;
    const plantRef = doc(db, "plants", plantId as string);
    await updateDoc(plantRef, {
      name: newName,
      seedDate: newDate.toISOString(),
      comment: newComment,
      waterLevel,
      fertilizerLevel,
      temperature,
    });

    const storedPlants = await AsyncStorage.getItem("plants");
    if (storedPlants) {
      const parsed = JSON.parse(storedPlants);
      const updated = parsed.map((p: any) =>
        p.id === plantId
          ? {
              ...p,
              name: newName,
              date: newDate.toDateString(),
              waterLevel,
              fertilizerLevel,
              temperature,
            }
          : p
      );
      await AsyncStorage.setItem("plants", JSON.stringify(updated));
    }

    Alert.alert("Saved", "Changes saved successfully!");
  };

  // Удаление растения и журнала
  const deletePlant = async () => {
    Alert.alert("Delete plant?", "All entries and the plant itself will be deleted", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const journalRef = collection(db, "plants", plantId as string, "journal");
            const journalSnap = await getDocs(journalRef);
            const deletions = journalSnap.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletions);

            await deleteDoc(doc(db, "plants", plantId as string));

            const storedPlants = await AsyncStorage.getItem("plants");
            if (storedPlants) {
              const parsed = JSON.parse(storedPlants);
              const filtered = parsed.filter((p: any) => p.id !== plantId);
              await AsyncStorage.setItem("plants", JSON.stringify(filtered));
            }

            router.push("/(screens)/home");
          } catch (err) {
            console.error("Deletion error:", err);
          }
        },
      },
    ]);
  };

  // Функция для выбора изображения
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Grant access to gallery to pick a photo");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Добавить запись в журнал
  const addJournalEntry = async () => {
    if (!plantId || !newEntry.trim()) return;
    const journalRef = collection(db, "plants", plantId as string, "journal");
    const newDoc = await addDoc(journalRef, {
      text: newEntry,
      createdAt: Timestamp.now(),
      photoUrl: imageUri || null,
    });
    setJournal((prev) => [
      ...prev,
      { id: newDoc.id, text: newEntry, createdAt: Timestamp.now(), photoUrl: imageUri },
    ]);
    setNewEntry("");
    setImageUri(null);
    alert("Entry added!");
  };

  // Обновление состояний для воды, удобрений и температуры
  const updatePlantStatus = async (field: string, value: number) => {
    if (!plantId) return;
    const plantRef = doc(db, "plants", plantId as string);
    await updateDoc(plantRef, { [field]: value });

    const storedPlants = await AsyncStorage.getItem("plants");
    if (storedPlants) {
      const parsed = JSON.parse(storedPlants);
      const updated = parsed.map((p: any) =>
        p.id === plantId ? { ...p, [field]: value } : p
      );
      await AsyncStorage.setItem("plants", JSON.stringify(updated));
    }
  };

  const changeWaterLevel = (amount: number) => {
    const newLevel = Math.max(0, Math.min(100, waterLevel + amount));
    setWaterLevel(newLevel);
    updatePlantStatus("waterLevel", newLevel);
  };

  const changeFertilizerLevel = (amount: number) => {
    const newLevel = Math.max(0, Math.min(100, fertilizerLevel + amount));
    setFertilizerLevel(newLevel);
    updatePlantStatus("fertilizerLevel", newLevel);
  };

  const changeTemperature = (amount: number) => {
    const newTemp = Math.max(5, Math.min(40, temperature + amount));
    setTemperature(newTemp);
    updatePlantStatus("temperature", newTemp);
  };

  if (!plant) return <Text style={styles.text}>Loading...</Text>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <FlatList
        data={journal.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.journalItem}>
            <Text style={styles.text}>
              {item.createdAt?.toDate().toLocaleString()} — {item.text}
            </Text>
            {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.image} />}
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>🌱 {newName}</Text>
            <Text style={styles.label}>Plant Name</Text>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} />

            <Text style={styles.label}>Seed Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text>{newDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  if (Platform.OS === "android") setShowDatePicker(false);
                  if (date) setNewDate(date);
                }}
              />
            )}

            <Text style={styles.label}>Comment (substrate, conditions)</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />

            {/* Шкалы для воды, удобрений и температуры */}
            <View style={styles.statusContainer}>
              <Text style={styles.label}>💧 Water Level: {waterLevel}%</Text>
              <ProgressBar progress={waterLevel / 100} color="#4CAF50" style={styles.progressBar} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => changeWaterLevel(10)}>
                  <Text style={styles.actionText}>+10%</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => changeWaterLevel(-10)}>
                  <Text style={styles.actionText}>-10%</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>🌱 Fertilizer: {fertilizerLevel}%</Text>
              <ProgressBar progress={fertilizerLevel / 100} color="#FFEB3B" style={styles.progressBar} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => changeFertilizerLevel(10)}>
                  <Text style={styles.actionText}>+10%</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => changeFertilizerLevel(-10)}>
                  <Text style={styles.actionText}>-10%</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>🌡 Temperature: {temperature}°C</Text>
              <ProgressBar progress={temperature / 40} color="#FF5722" style={styles.progressBar} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => changeTemperature(1)}>
                  <Text style={styles.actionText}>+1°C</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => changeTemperature(-1)}>
                  <Text style={styles.actionText}>-1°C</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="New journal entry"
              value={newEntry}
              onChangeText={setNewEntry}
            />
            {imageUri && <Image source={{ uri: imageUri }} style={[styles.image, { height: 250 }]} />}
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <Text style={styles.actionText}>Pick Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={addJournalEntry}>
              <Text style={styles.actionText}>Add Entry</Text>
            </TouchableOpacity>
            <View style={styles.buttonRowBottom}>
              <TouchableOpacity style={styles.saveButton} onPress={savePlantChanges}>
                <Text style={styles.saveText}>💾 Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={deletePlant}>
                <Text style={styles.deleteText}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f7ec",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e5e3e",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#a7c4a0",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  datePicker: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#a7c4a0",
    borderWidth: 1,
    borderRadius: 10,
  },
  statusContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f7ef",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0e1d4",
  },
  progressBar: {
    height: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  actionButton: {
    backgroundColor: "#3A5A40",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  actionText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    color: "#3A5A40",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  journalItem: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#d0e1d4",
    borderWidth: 1,
  },
  buttonRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: "#7aa17a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#cc3a3a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
